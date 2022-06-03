<template>
  <div class="file-tree-view">
    <div class="file-actions-bar">
      <v-icon dark class="pointer icon-class" @click="executeCode">
        fa-solid fa-play
      </v-icon>
      <v-icon dark class="pointer icon-class"> fa-solid fa-bug </v-icon>
      <v-icon dark class="pointer icon-class">
        fa-solid fa-file-circle-plus
      </v-icon>
      <v-icon
        dark
        class="pointer icon-class"
        @click="showSearchBar = !showSearchBar"
      >
        fas fa-search
      </v-icon>
      <v-icon dark class="pointer icon-class"> fas fa-ellipsis-v </v-icon>
    </div>
    <v-text-field
      v-if="showSearchBar"
      v-model="search"
      class="search-box"
      label="Search files"
      dark
      flat
      solo
      hide-details
      clearable
      clear-icon="mdi-close-circle-outline"
    ></v-text-field>
    <v-treeview
      v-model="tree"
      :open="initiallyOpen"
      :items="items"
      :search="search"
      :filter="filter"
      :case-sensitive="caseSensitive"
      :active.sync="activeItems"
      activatable
      dark
      item-key="name"
      open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.file">
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon v-else>
          {{ files[item.file] }}
        </v-icon>
      </template>
    </v-treeview>
    <iframe
      src="/python.html"
      style="height: 0px; width: 0px"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
export default {
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    },
    activeFileContents() {
      if (this.activeItems.length === 0) return "";
      return this.items.find((item) => item.name === this.activeItems[0])
        .content;
    },
  },
  watch: {
    activeItems(val) {
      console.log(val);

      if (val.length === 0) return;
      if (!window.editor) return;

      window.editor.setValue(this.activeFileContents);
    },
  },
  data: () => ({
    initiallyOpen: ["public"],
    files: {
      html: "mdi-language-html5",
      js: "mdi-nodejs",
      json: "mdi-code-json",
      md: "mdi-language-markdown",
      pdf: "mdi-file-pdf",
      png: "mdi-file-image",
      txt: "mdi-file-document-outline",
      xls: "mdi-file-excel",
      py: "mdi-language-python",
    },
    iframe: null,
    tree: [],
    activeItems: ["main.py"],
    items: [
      {
        name: "main.py",
        content: "print('hello from script')",
        file: "py",
      },
    ],
    showSearchBar: false,
    search: null,
    caseSensitive: false,
  }),
  mounted() {
    setTimeout(this.initListerner, 3000);
  },
  methods: {
    updateFileContents(file, content) {
      this.items = this.items.map((item) => {
        if (item.name === file) {
          item.content = content;
        }
        return item;
      });
    },
    async executeCode() {
      console.log("execute code");
      let iframe = document.querySelector("iframe");
      iframe.contentWindow.runCode(this.activeFileContents);
    },
    initListerner() {
      let iframe = document.querySelector("iframe");
      iframe.contentWindow.init();

      window.editor.onDidChangeModelContent(() => {
        if (this.activeItems.length === 0) return;

        this.updateFileContents(this.activeItems[0], window.editor.getValue());
      });
    },
  },
};
</script>

<style>
.file-tree-view {
  height: 100vh;
  background: #444;
}

.search-box {
  padding: 20px !important;
}
.file-actions-bar {
  background: #222;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.icon-class {
  margin: 5px 15px;
}
</style>