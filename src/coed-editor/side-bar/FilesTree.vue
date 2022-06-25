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
        @click="showFileCreateDialog = !showFileCreateDialog"
      >
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
    <v-dialog v-model="showFileCreateDialog" width="500" attach="body">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Create File
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="File name"
            v-model="fileName"
            hide-details="auto"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addNewFile"> Save </v-btn>
          <v-btn text @click="showFileCreateDialog = false"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    ...mapGetters(["getFileSystem", "getActiveFile"]),
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
    iframe: null,
    tree: [],
    activeItems: [],
    showSearchBar: false,
    search: null,
    caseSensitive: false,
    inputValue: null,
    showFileCreateDialog: false,
    fileName: "",
  }),
  methods: {
    ...mapActions(["addFile", "changeActiveFile"]),
    addNewFile() {
      let fileObj = {
        name: this.fileName,
        content: "",
        file: "py",
      };
      this.addFile(fileObj);
      this.showFileCreateDialog = false;
      this.fileName = "";
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
  padding: 20px !important;
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