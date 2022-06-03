<template>
  <div id="app" style="width: 100%" :style="editorHeight">
    <div ref="editor" style="width: 100%" :style="editorHeight"></div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor";

export default {
  async mounted() {
    const el = this.$refs.editor;
    window.editor = monaco.editor.create(el, {
      value: "print('Hello World')",
      language: "python",
      theme: "vs-dark",
    });
  },
  data() {
    return {
      editorHeight: { height: "100vh" },
    };
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
