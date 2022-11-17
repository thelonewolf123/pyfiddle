<template>
  <div class="file-tree-view">
    <div class="file-actions-bar">
      <!-- <v-icon dark class="pointer icon-class" @click="executeCode">
        fa-solid fa-play
      </v-icon>
      <v-icon dark class="pointer icon-class"> fa-solid fa-bug </v-icon> -->
      <v-icon
        dark
        class="pointer icon-class"
        @click="showNewFileBox = !showNewFileBox"
      >
        fa-solid fa-file-circle-plus
      </v-icon>
      <v-icon
        dark
        class="pointer icon-class"
        @click="showRenameFileAction"
        :disabled="!activeItems.length"
      >
        fa-solid fa-pen
      </v-icon>
      <v-icon
        dark
        class="pointer icon-class"
        @click="deleteFile"
        :disabled="!activeItems.length"
      >
        fa-solid fa-trash
      </v-icon>
      <v-icon
        dark
        class="pointer icon-class"
        @click="showSearchBar = !showSearchBar"
      >
        fas fa-search
      </v-icon>
      <!-- <v-icon dark class="pointer icon-class"> fas fa-ellipsis-v </v-icon> -->
    </div>
    <v-text-field
      v-if="showSearchBar"
      v-model="search"
      class="search-box"
      label="search files..."
      dark
      solo
      hide-details
      clearable
      clear-icon="mdi-close-circle-outline"
    ></v-text-field>
    <v-text-field
      v-if="showNewFileBox"
      v-model="fileName"
      class="search-box"
      label="file name"
      dark
      solo
      hide-details
      clear-icon="mdi-close-circle-outline"
      @keyup.enter="addNewFile"
    ></v-text-field>
    <v-text-field
      v-if="showRenameFileBox"
      v-model="fileName"
      class="search-box"
      label="file name"
      dark
      solo
      hide-details
      clear-icon="mdi-close-circle-outline"
      @keyup.enter="renameFile"
    ></v-text-field>
    <v-treeview
      v-model="tree"
      :open="initiallyOpen"
      :items="getFileSystem"
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    },
    ...mapGetters(["getFileSystem", "getActiveFile", "getActiveFileContent"]),
  },
  watch: {
    activeItems(newVal) {
      if (newVal && newVal.length > 0) this.changeActiveFile(newVal[0]);
    },
    getActiveFile(newVal) {
      if (newVal) {
        this.activeItems = [newVal];
      }
    },
  },
  mounted() {
    this.activeItems = [this.getActiveFile];
  },
  data: () => ({
    initiallyOpen: [],
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
    tree: [],
    activeItems: [],
    showSearchBar: false,
    showNewFileBox: false,
    showRenameFileBox: false,
    search: null,
    caseSensitive: false,
    inputValue: null,
    fileName: "",
  }),
  methods: {
    ...mapActions(["addFile", "changeActiveFile", "removeFile"]),
    addNewFile() {
      if (!this.fileName) {
        this.$notify("can't create a file with empty file name.");
        return;
      }
      let fileObj = {
        name: this.fileName,
        content: "",
        file: this.fileName.split(".").pop(),
      };
      this.addFile(fileObj);
      this.showFileCreateDialog = false;
      this.fileName = "";
      this.showNewFileBox = false;
    },
    deleteFile() {
      console.log(this.fileName);
      const result = confirm(
        `Do you really want to delete ${this.getActiveFile}?`
      );

      if (!result) return;

      this.removeFile({
        name: this.getActiveFile,
      });
    },
    showRenameFileAction() {
      this.showRenameFileBox = !this.showRenameFileBox;
      if (this.showRenameFileBox) {
        this.fileName = this.getActiveFile;
      }
    },
    renameFile() {
      if (!this.fileName) {
        this.$notify("can't save a file with empty file name.");
        return;
      }

      let fileObj = {
        name: this.fileName,
        content: this.getActiveFileContent,
        file: this.fileName.split(".").pop(),
      };
      this.removeFile({
        name: this.getActiveFile,
      });

      this.addFile(fileObj);
      this.showRenameFileBox = false;
      this.fileName = "";
      this.showNewFileBox = false;
    },
  },
};
</script>

<style>
.file-tree-view {
  height: 50vh;
  background: #444;
}

.search-box {
  padding: 4px !important;
}
.file-actions-bar {
  background: #222;
  padding: 10px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.icon-class {
  margin: 0px 15px;
  cursor: pointer;
  font-size: 1rem !important;
}

.v-treeview-node__label {
  padding-left: 5px;
}
</style>