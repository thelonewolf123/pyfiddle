<template>
  <div ref="editor"></div>
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
  },

  async mounted() {
    const el = this.$refs.editor;
    window.editor = monaco.editor.create(el, {
      value: this.code,
      language: this.language,
      theme: this.theme,
    });
    window.editor.onDidChangeModelContent(() => {
      this.$emit("codeChanged", window.editor.getValue());
    });
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
