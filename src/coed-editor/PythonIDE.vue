<template>
  <div class="ide-main-content">
    <navbarIdeVue></navbarIdeVue>
    <div class="content-area">
      <side-bar-vue style="width: 350px"></side-bar-vue>
      <div class="editor-output-view">
        <file-titles-vue
          :files="fileTitles"
          :activeFile="fileName"
          @removeFileTitle="removeFileTitle"
        ></file-titles-vue>
        <monaco-editor-vue
          style="width: 100%; height: 75vh"
          :code="fileContent"
          :language="languageMap[fileName.split('.').pop()]"
          theme="vs-dark"
          :filename="getActiveFile"
          :debuggerLineNumber="getDebuggerLineNumber"
          @codeChanged="codeChanged"
        ></monaco-editor-vue>
        <output-view-vue></output-view-vue>
      </div>
    </div>
  </div>
</template>

<script>
import MonacoEditorVue from "./MonacoEditor.vue";
import SideBarVue from "./SideBar.vue";
import OutputViewVue from "./output/OutputView.vue";
import FileTitlesVue from "./side-bar/FileTitles.vue";
import navbarIdeVue from "@/components/navbar-ide.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    MonacoEditorVue,
    SideBarVue,
    OutputViewVue,
    FileTitlesVue,
    navbarIdeVue,
  },
  computed: {
    ...mapGetters([
      "getActiveFile",
      "getActiveFileContent",
      "getDebuggerLineNumber",
    ]),
    fileName() {
      return this.getActiveFile;
    },
  },
  watch: {
    fileName(newVal) {
      if (newVal) {
        console.log(newVal);
        this.fileContent = this.getActiveFileContent;
        let index = this.fileTitles.findIndex((t) => t === newVal);
        if (index !== -1) return;
        this.fileTitles.push(newVal);
      }
    },
  },
  data() {
    return {
      fileContent: null,
      fileTitles: [],
      languageMap: {
        py: "python",
        cpp: "cpp",
        json: "json",
        txt: "plaintext",
        md: "markdown",
        js: "javascript",
      },
    };
  },
  methods: {
    ...mapActions([
      "changeActiveFileContent",
      "initFileSystem",
      "changeActiveFile",
    ]),
    codeChanged(newCode) {
      if (!this.getActiveFile) return;
      this.changeActiveFileContent(newCode);
    },
    removeFileTitle(index) {
      console.log(index);
      this.fileTitles.splice(index, 1);
    },
  },
};
</script>


<style>
.content-area {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 35px);
  overflow: hidden;
}

.container {
  padding: 0px !important;
}

.top-bar {
  background: rgb(155, 155, 155);
  height: 20px;
}

.editor-output-view {
  height: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
}
</style>