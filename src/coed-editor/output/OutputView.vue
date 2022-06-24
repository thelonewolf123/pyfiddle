<template>
  <div class="output-view">
    <div class="control-bar">
      <v-icon
        dark
        v-if="!isCodeRunnig"
        class="pointer icon-class"
        @click="runCode"
        :disabled="!isInterpreterReady"
      >
        fa-solid fa-play
      </v-icon>
      <v-icon
        v-show="isCodeRunnig"
        dark
        class="pointer icon-class"
        @click="stopExecution"
      >
        fa-solid fa-stop
      </v-icon>
      <v-icon dark class="pointer icon-class" :disabled="true">
        fa-solid fa-bug
      </v-icon>
    </div>
    <div class="output-section">
      <div class="output" :key="index" v-for="(out, index) in output">
        <div class="output-line">
          <div class="output-text">
            {{ out }}
          </div>
          <input
            v-if="showInput && index == output.length - 1"
            v-model="inputValue"
            v-on:keyup.enter="submitInput"
            class="input-box"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
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
      isCodeRunnig: false,
    };
  },
  computed: {
    ...mapGetters(["getActiveFile", "getActiveFileContent"]),
    fileContent() {
      return this.getActiveFileContent;
    },
    fileName() {
      return this.getActiveFile;
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    if (!this.pyodideWorker) return;
    this.pyodideWorker.terminate();
  },
  methods: {
    async executeCode() {},
    init() {
      this.output = [];
      this.showInput = false;
      this.inputValue = "";
      this.pdbState = 0;
      this.isPdbActive = false;
      this.pyodideWorker = new Worker("/js/pyodide-worker.js");

      this.pyodideWorker.postMessage({
        cmd: "init",
      });

      this.interruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
      this.inputFlagBuffer = new Int32Array(new SharedArrayBuffer(4));
      this.inputValueBuffer = new Uint8Array(new SharedArrayBuffer(512));

      this.pyodideWorker.onmessage = (e) => {
        if (e.data.cmd === "ready") {
          this.isInterpreterReady = true;

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
        } else if (e.data.cmd === "stdout") {
          this.output.push(e.data.data);
        } else if (e.data.cmd === "stderr") {
        } else if (e.data.cmd === "stdin") {
          // convert string to shared memory
          this.showInput = true;
        } else if (e.data.cmd === "done") {
          this.isCodeRunnig = false;
        }
      };
    },
    async runCode() {
      // Clear interruptBuffer in case it was accidentally left set after previous code completed.
      this.interruptBuffer[0] = 0;
      this.output = [];
      // Run code in worker.
      console.log("Running code in worker...");
      this.pyodideWorker.postMessage({
        cmd: "runCode",
        code: this.fileContent,
      });
      this.isCodeRunnig = true;
    },
    submitInput() {
      let inputValue = this.inputValue;
      let inputPrompt = this.output.pop();
      this.inputValue = "";
      this.showInput = false;

      this.output.push(`${inputPrompt}  ${inputValue}`);

      let input = new TextEncoder("utf-8").encode(inputValue);
      // copy input to shared memory
      this.inputValueBuffer.set(input);
      // set flag to indicate input is ready
      Atomics.store(this.inputFlagBuffer, 0, 0);
      // wake up python
      Atomics.notify(this.inputFlagBuffer, 0, 1);
    },
    stopExecution() {
      // set interupt buffer to 2 to stop execution
      this.interruptBuffer[0] = 2;
    },
  },
};
</script>

<style lang="scss" scoped>
.output-view {
  height: 350px;
  width: 100%;
  overflow: hidden;
  background: #444;
}
.output-section {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  color: aliceblue;
  font-family: "Courier New", Courier, monospace;
  font-size: 16px;
  font-weight: 600;
  padding: 10px;
  margin-bottom: 25px;
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
  }
}
</style>