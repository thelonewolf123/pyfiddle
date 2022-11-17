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
    filename: {
      type: String,
    },
    debuggerLineNumber: {
      type: Number,
      default: null,
    },
  },
  watch: {
    filename(file) {
      if (this.model) this.model.dispose();
      this.model = monaco.editor.createModel(this.code, this.language, file);
      this.editor.setModel(this.model);
    },
    debuggerLineNumber(newVal) {
      if (newVal) {
        this.targetId = this.editorLineHighlight(
          newVal,
          "debuggerContentClass",
          "debuggerGlyphMarginClass",
          this.targetId
        );
      }
    },
  },
  async mounted() {
    const el = this.$refs.editor;
    this.editor = monaco.editor.create(el, {
      value: this.code,
      language: this.language,
      theme: this.theme,
      wordBasedSuggestions: true,
      quickSuggestions: true,
      glyphMargin: true,
      lightbulb: {
        enabled: true,
      },
    });
    this.editor.onDidChangeModelContent(() => {
      this.$emit("codeChanged", this.editor.getValue());
    });
  },
  data() {
    return {
      targetId: [],
      model: null,
      editor,
    };
  },
  methods: {
    editorLineHighlight(lineNo, className, marginClassName, targetId) {
      let decoration = this.editor.deltaDecorations(
        [targetId],
        [
          {
            range: new monaco.Range(lineNo, 1, lineNo, 1),
            options: {
              isWholeLine: true,
              className: className,
              glyphMarginClassName: marginClassName,
            },
          },
        ]
      );
      return decoration[0];
    },
  },
  destroyed() {
    if (this.model) this.model.dispose();
    if (this.editor) this.editor.dispose();
  },
};
// reference - https://github.com/microsoft/monaco-editor/issues/2530
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
/* .debuggerGlyphMarginClass {
  background: #f00;
  border-radius: 25px;
  margin-left: 10px;
  height: 10px !important;
  width: 10px !important;
} */
.debuggerContentClass {
  background: #4a5116;
}
</style>
