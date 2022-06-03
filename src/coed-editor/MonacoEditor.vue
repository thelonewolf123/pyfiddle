<template>
  <div id="app" style="width: 100%" :style="editorHeight">
    <div ref="editor" style="width: 100%" :style="editorHeight"></div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor";

export default {
  props: {
    code: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "python",
    },
    theme: {
      type: String,
      default: "vs-dark",
    },
    height: {
      type: String,
      default: "100%",
    },
  },

  async mounted() {
    const el = this.$refs.editor;
    window.editor = monaco.editor.create(el, {
      value: this.code,
      language: "python",
      theme: "vs-dark",
    });
    window.editor.onDidChangeModelContent(() => {
      this.$emit("codeChanged", window.editor.getValue());
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
