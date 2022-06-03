<template>
  <div class="ide-main-content">
    <!-- <div class="top-bar">

        </div> -->
    <div class="content-area">
      <side-bar-vue style="width: 350px"></side-bar-vue>
      <monaco-editor-vue
        style="width: calc(100% - 350px)"
        :code="fileContent"
        @codeChanged="codeChanged"
      ></monaco-editor-vue>
    </div>
  </div>
</template>

<script>
import MonacoEditorVue from "./MonacoEditor.vue";
import SideBarVue from "./SideBar.vue";
export default {
  components: {
    MonacoEditorVue,
    SideBarVue,
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
</style>