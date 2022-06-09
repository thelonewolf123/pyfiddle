<template>
  <div class="ide-main-content">
    <div class="content-area">
      <side-bar-vue style="width: 350px"></side-bar-vue>
      <div class="editor-output-view">
        <file-titles-vue :files="['main.py']"></file-titles-vue>
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
export default {
  components: {
    MonacoEditorVue,
    SideBarVue,
    OutputViewVue,
    FileTitlesVue,
  },
  data() {
    return {
      fileName: "main.py",
      fileContent: "print('hello from script')",
    };
  },
  mounted() {
    window.addEventListener("fileChanged", (event) => {
      this.fileName = event.detail.fileName;
      this.sourceCode = event.detail.fileContent;
    });
  },
  methods: {
    codeChanged(newCode) {
      this.fileContent = newCode;
      let event = new CustomEvent("fileChanged", {
        detail: {
          fileName: this.fileName,
          fileContent: this.fileContent,
        },
      });
      window.dispatchEvent(event);
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