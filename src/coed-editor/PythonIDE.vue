<template>
  <div class="ide-main-content">
    <div class="content-area">
      <side-bar-vue style="width: 350px"></side-bar-vue>
      <div class="editor-output-view">
        <file-titles-vue
          :files="fileTitles"
          :activeFile="fileName"
          @removeFileTitle="removeFileTitle"
        ></file-titles-vue>
        <monaco-editor-vue
          style="width: 100%; height: calc(100vh - 350px)"
          :code="fileContent"
          language="python"
          theme="vs-dark"
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
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    MonacoEditorVue,
    SideBarVue,
    OutputViewVue,
    FileTitlesVue,
  },
  computed: {
    ...mapGetters(["getActiveFile", "getActiveFileContent"]),
    fileName() {
      return this.getActiveFile;
    },
  },
  watch: {
    fileName(newVal) {
      if (newVal) {
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
    };
  },
  mounted() {
    let fileSystem = window.localStorage.getItem("fileSystem");
    if (fileSystem) {
      this.initFileSystem(JSON.parse(fileSystem));
    }
    this.fileContent = this.getActiveFileContent;
    this.fileTitles.push(this.getActiveFile);
  },
  methods: {
    ...mapActions(["changeActiveFileContent", "initFileSystem"]),
    codeChanged(newCode) {
      this.changeActiveFileContent(newCode);
    },
    removeFileTitle(index) {
      this.fileTitles.splice(index, 1);
    },
  },
};
</script>


<style>
.content-area {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.top-bar {
  background: rgb(155, 155, 155);
  height: 20px;
}

.editor-output-view {
  height: 100vh;
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
}
</style>