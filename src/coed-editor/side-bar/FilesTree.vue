<template>
  <div>
    <v-card dark class="file-tree-section mx-auto" max-width="500">
      <v-sheet class="pa-4 search-box primary lighten-2">
        <v-text-field
          v-model="search"
          label="Search Company Directory"
          dark
          flat
          solo-inverted
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
        <v-checkbox
          v-model="caseSensitive"
          dark
          hide-details
          label="Case sensitive search"
        ></v-checkbox>
      </v-sheet>
      <v-card-text>
        <v-treeview
          v-model="tree"
          :open="initiallyOpen"
          :items="items"
          :search="search"
          :filter="filter"
          :case-sensitive="caseSensitive"
          :active.sync="activeItems"
          activatable
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
      </v-card-text>
    </v-card>
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
  },
  watch: {
    activeItems(val) {
      console.log(val);
      this.$emit("activeItemChanged", val[0]);
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
    tree: [],
    activeItems: [],
    items: [
      {
        name: "main.py",
        content: "print('hello from script')",
        file: "py",
      },
    ],

    search: null,
    caseSensitive: false,
  }),
  methods: {},
};
</script>

<style>
.file-tree-section {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.search-box {
  padding: 20px;
}
</style>