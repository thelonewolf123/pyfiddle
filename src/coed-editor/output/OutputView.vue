<template>
  <div class="output-view">
    <div class="control-bar">
      <v-icon
        dark
        v-if="!isCodeRunning"
        class="pointer icon-class"
        @click="runCode"
        :disabled="!isInterpreterReady && !getActiveFile"
      >
        fa-solid fa-play
      </v-icon>
      <v-icon
        v-show="isCodeRunning"
        dark
        class="pointer icon-class"
        @click="stopExecution"
      >
        fa-solid fa-stop
      </v-icon>
      <v-icon
        v-if="!isCodeRunning"
        dark
        class="pointer icon-class"
        @click="runWithDebuggerHandler"
        :disabled="!isInterpreterReady && !getActiveFile"
      >
        fa-solid fa-bug
      </v-icon>
      <v-icon
        dark
        v-if="runWithDebugger"
        class="pointer icon-class"
        :disabled="!isWaitingForPdb"
        @click="continueExecutionHandler"
      >
        fas fa-forward
      </v-icon>
      <v-icon
        dark
        v-if="runWithDebugger"
        class="pointer icon-class"
        :disabled="!isWaitingForPdb"
        @click="singleStepExecutionHandler"
      >
        fas fa-step-forward
      </v-icon>
      <v-icon
        dark
        v-if="runWithDebugger"
        class="pointer icon-class"
        :disabled="!isWaitingForPdb"
        @click="stepIntoExecutionHandler"
      >
        fa-solid fa-caret-down
      </v-icon>
      <v-icon
        dark
        class="pointer icon-class"
        :disabled="isCodeRunning"
        @click="clearOutput"
      >
        fas fa-eraser
      </v-icon>
    </div>
    <div class="output-and-debug-section">
      <div class="output-section" :class="{ width50: runWithDebugger }">
        <div class="output" :key="index" v-for="(out, index) in output">
          <div class="output-line">
            <div
              class="output-text"
              :class="{ 'output-error': out.type === 'stderr' }"
            >
              {{ out.value }}
            </div>
            <input
              v-if="showInput && index == output.length - 1"
              v-model="inputValue"
              v-on:keyup.enter="submitInput()"
              ref="inputBoxStdin"
              autofocus
            />
          </div>
        </div>
        <div style="height: 50px"></div>
      </div>
      <LocalVariablesListVue
        v-if="runWithDebugger"
        class="local-var-section"
        :class="{ width50: runWithDebugger }"
        :localVariables="localVariables"
      />
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import DebuggerHelper from "./debuggerHelper";
import LocalVariablesListVue from "./LocalVariablesList.vue";

export default {
  components: {
    LocalVariablesListVue,
  },
  data() {
    return {
      output: [],
      showInput: false,
      inputValue: "",
      pdbState: 0,
      isPdbActive: false,
      isInterpreterReady: false,
      pyodideWorker: null,
      interruptBuffer: null,
      inputFlagBuffer: null,
      inputValueBuffer: null,
      isCodeRunning: false,
      localVariables: null,
      debuggerHelper: null,
      isWaitingForPdb: false,
      runWithDebugger: false,
      executedFileName: null,
      lastOutputPrompt: null,
    };
  },
  computed: {
    ...mapGetters([
      "getActiveFile",
      "getActiveFileContent",
      "getFileSystem",
      "getDependencies",
    ]),
    fileContent() {
      return this.getActiveFileContent;
    },
    fileName() {
      return this.getActiveFile;
    },
    dependencies() {
      return this.getDependencies;
    },
  },
  watch: {
    dependencies(newVal) {
      if (
        newVal &&
        newVal.length > 0 &&
        this.pyodideWorker &&
        this.isInterpreterReady
      ) {
        let lastPackage = newVal[newVal.length - 1];
        this.pyodideWorker.postMessage({
          cmd: "installPackage",
          packageName: lastPackage.packageName,
        });
        this.isCodeRunning = true;
      }
    },
    // showInput() {
    //   this.$refs.inputBoxStdin.$el.focus();
    // },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    if (!this.pyodideWorker) return;
    this.pyodideWorker.terminate();
  },
  methods: {
    ...mapActions([
      "changeDebugActiveLineNumber",
      "changeActiveFile",
      "removePyDependency",
      "initFileSystem",
    ]),
    init() {
      this.output = [];
      this.showInput = false;
      this.inputValue = "";
      this.pdbState = 0;
      this.isPdbActive = false;
      this.pyodideWorker = new Worker("/js/pyodide-worker.js");
      this.debuggerHelper = new DebuggerHelper();
      this.pyodideWorker.postMessage({
        cmd: "init",
      });

      this.interruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
      this.inputFlagBuffer = new Int32Array(new SharedArrayBuffer(4));
      this.inputValueBuffer = new Uint8Array(new SharedArrayBuffer(512));

      this.pyodideWorker.onmessage = (e) => {
        if (e.data.cmd === "ready") {
          this.inputFlagBuffer[0] = 0;
          this.interruptBuffer[0] = 0;

          this.pyodideWorker.postMessage({
            cmd: "setInterruptBuffer",
            interruptBuffer: this.interruptBuffer,
          });
          this.pyodideWorker.postMessage({
            cmd: "setInputBuffer",
            inputFlagBuffer: this.inputFlagBuffer,
            inputValueBuffer: this.inputValueBuffer,
          });
          this.dependencies.forEach((dep) => {
            this.isCodeRunning = true;
            this.pyodideWorker.postMessage({
              cmd: "installPackage",
              packageName: dep.packageName,
            });
          });

          this.isInterpreterReady = true;
        } else if (e.data.cmd === "stdout") {
          this.stdOutHandler(e.data.data);

          let outputPanel = document.querySelector(".output-section");
          outputPanel.scrollTop = outputPanel.scrollHeight;
        } else if (e.data.cmd === "stderr") {
          this.output.push({
            value: e.data.data,
            type: "stderr",
          });
        } else if (e.data.cmd === "stdin") {
          this.stdInhandler();
        } else if (e.data.cmd === "errorPackageInstall") {
          let packageName = e.data.packageName;
          this.removePyDependency(packageName);
        } else if (e.data.cmd === "done") {
          // this.pyodideWorker.postMessage({
          //   cmd: "syncFiles",
          // });
          this.isCodeRunning = false;
          this.runWithDebugger = false;
        } else if (e.data.cmd === "syncFiles") {
          console.log(e.data.data);
          // this.initFileSystem(e.data.data);
        }
      };
    },
    getFileSysObject(fileSystem) {
      let fileSystemCopy = JSON.parse(JSON.stringify(fileSystem));
      // fileSystemCopy = fileSystemCopy.filter((f) => f.name !== activeFileName);
      let newFileSystemObj = {
        projectFiles: [],
      };

      newFileSystemObj.projectFiles = this.flatTree(fileSystemCopy, "/root");

      return newFileSystemObj;
    },
    flatTree(s, parent) {
      if (s.name) {
        result.push({
          path: `${parent}/${s.name}`.replace("/root", ""),
          isFolder: !s.file,
          content: s.file ? s.content : null,
        });
      }

      if (s.children) {
        s.children.map((v) => {
          flatTree(v, `${parent}/${s.name}`);
        });
      }
    },
    runWithDebuggerHandler() {
      this.runWithDebugger = true;
      this.runCode();
    },
    stdOutHandler(output) {
      if (!this.runWithDebugger) {
        this.output.push({ value: output, type: "stdout" });
        return;
      }

      this.lastOutputPrompt = output;

      if (this.isPdbStarted(output) && !this.isPdbActive) {
        this.isPdbActive = true;
        // this.debuggerHelper.resetDebugger();
        this.debuggerHelper.setDebuggerActive(true);
        this.debuggerHelper.parsePdbOutPut(output);
      } else if (this.isPdbActive === true && this.isPdbParsingOutput(output)) {
        this.debuggerHelper.parsePdbOutPut(output);
      } else if (output !== "--Return--" && output !== "--Call--") {
        this.output.push({ value: output, type: "stdout" });
      }

      if (this.debuggerHelper.getFileName() === "<executedMainFile>")
        this.changeActiveFile(this.executedFileName);
      else if (this.debuggerHelper.getFileName())
        this.changeActiveFile(this.debuggerHelper.getFileName());

      if (this.debuggerHelper.getLineNumber())
        this.changeDebugActiveLineNumber(this.debuggerHelper.getLineNumber());

      this.isPdbActive = this.debuggerHelper.getDebuggerStatus();
      this.localVariables = this.debuggerHelper.getVariableMap();
    },
    isPdbParsingOutput(output) {
      if (!output) return true;
      else if (output.startsWith(">")) return true;
      else if (output === "debug-finished") return true;
      else if (output.startsWith("<<")) return true;
      else if (output.startsWith("->")) return true;
      else if (output.startsWith("(Pdb) ")) return true;
      else if (output.startsWith("> /home/pyodide")) return true;
      return false;
    },
    isPdbStarted(output) {
      if (output && output.startsWith("> /home/pyodide")) return true;
      else if (output && output.startsWith("> <exec>")) return true;
      else if (output && output === "(Pdb) ") return true;
      return false;
    },
    stdInhandler() {
      if (!this.runWithDebugger) {
        this.showInput = true;
        return;
      }

      if (!this.isPdbActive) {
        this.showInput = true;
      }

      this.isPdbActive = this.debuggerHelper.getDebuggerStatus();

      if (this.lastOutputPrompt && this.lastOutputPrompt !== "(Pdb) ") {
        this.showInput = true;
        return;
      }

      let cmd = this.debuggerHelper.getPdbCommand();
      if (this.isPdbActive && cmd !== "pause") {
        this.inputValue = cmd;
        this.submitInput(true);
      } else {
        this.isWaitingForPdb = true;
      }
    },
    continueExecutionHandler() {
      this.inputValue = "continue";
      this.submitInput(true);
      this.isWaitingForPdb = false;
    },
    singleStepExecutionHandler() {
      this.inputValue = "next";
      this.submitInput(true);
      this.isWaitingForPdb = false;
    },
    stepIntoExecutionHandler() {
      this.inputValue = "step";
      this.submitInput(true);
      this.isWaitingForPdb = false;
    },
    async runCode() {
      // Clear interruptBuffer in case it was accidentally left set after previous code completed.
      this.interruptBuffer[0] = 0;
      this.output = [];
      // Run code in worker.
      console.log("Running code in worker...");
      this.debuggerHelper.resetDebugger();
      this.pyodideWorker.postMessage({
        cmd: "runCode",
        files: this.getFileSysObject(this.getFileSystem),
        code: this.getActiveFileContent,
      });
      this.executedFileName = this.getActiveFile;
      this.isCodeRunning = true;
    },
    submitInput(excludeOutput) {
      let inputValue = this.inputValue ? this.inputValue : "";
      this.inputValue = "";

      if (!excludeOutput) {
        let inputPrompt = this.output.pop();
        this.output.push({
          value: `${inputPrompt.value} ${inputValue}`,
          type: "stdout",
        });
      }

      this.showInput = false;

      for (let i = inputValue.length; i < 512; i++) {
        inputValue += "\x00";
      }
      let input = new TextEncoder("utf-8").encode(inputValue);
      // copy input to shared memory
      // this.inputValueBuffer.splice(0, 511);
      this.inputValueBuffer.set(input);
      // set flag to indicate input is ready
      Atomics.store(this.inputFlagBuffer, 0, 0);
      // wake up python
      Atomics.notify(this.inputFlagBuffer, 0, 1);
    },
    stopExecution() {
      // set interrupt buffer to 2 to stop execution
      this.interruptBuffer[0] = 2;
      this.pyodideWorker.terminate();
      this.init();
      this.isInterpreterReady = false;
      this.isCodeRunning = false;
      this.runWithDebugger = false;
    },
    clearOutput() {
      this.output = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.output-view {
  width: 100%;
  overflow: hidden;
  background: #222;
}

.output-and-debug-section {
  display: flex;
}

.local-var-section {
  width: 100%;
  height: 25vh;
  background: #444;
  /* height: 100%; */
}
.output-section {
  height: 25vh;
  width: 100%;
  overflow-y: scroll;
  overflow-x: scroll;
  color: aliceblue;
  font-family: "Courier New", Courier, monospace;
  font-size: 16px;
  font-weight: 600;
  padding: 10px;
  /* padding-bottom: 100px; */
}
.control-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 40px;
  padding: 0px 10px;
  background: #333;
}
.output-line {
  display: flex;
  flex-direction: row;
  align-items: center;

  input:focus {
    outline: none;
  }

  input {
    outline: none;
    border: none;
    max-width: 100%;
    color: aliceblue;
    padding-left: 5px;
    flex-grow: 10;
    background-color: #333;
  }
}

.output-text.output-error {
  color: red;
}

.width50 {
  width: 50%;
}
</style>