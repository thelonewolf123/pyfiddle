<template>
  <div class="file-titles">
    <div
      class="single-file-title"
      :class="{ 'active-file': fileName === activeFile }"
      :key="index"
      @click="handlerTitleClick(fileName)"
      v-for="(fileName, index) in files"
    >
      <div class="file-name-section">
        {{ fileName }}
      </div>
      <v-icon
        dark
        class="icon-x-mark"
        @click="handlerDeleteClick(index, fileName)"
        style="margin-top: 7px"
        v-if="files.length > 1"
      >
        fa-solid fa-xmark
      </v-icon>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    files: {
      type: Array,
      required: true,
    },
    activeFile: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["getFileSystem"]),
  },
  watch: {
    getFileSystem(fileSystem) {
      this.files.map((fileName, index) => {
        const isFileExist = fileSystem.find(({ name }) => name === fileName);
        if (isFileExist) return;
        this.handlerDeleteClick(index);
      });
    },
  },
  methods: {
    ...mapActions(["changeActiveFile"]),
    handlerTitleClick(fileName) {
      this.changeActiveFile(fileName);
    },
    handlerDeleteClick(index) {
      if (this.files.length === 1) return;
      this.$emit("removeFileTitle", index);
      let newIndex = index - 1 >= 0 ? index - 1 : 0;
      this.changeActiveFile(this.files[newIndex]);
    },
  },
};
</script>

<style>
.file-titles {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 4px solid #333;
  height: 40px;
  background: #444;
  line-height: 1;
}

.single-file-title {
  font-size: 1.2rem;
  font-weight: 400;
  color: aliceblue;
  padding: 0.5rem;
  background: #555;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-right: 2px;
  cursor: pointer;
}

.active-file {
  background: #222;
}
.icon-x-mark {
  font-size: 0.9rem !important;
  cursor: pointer;
  padding-left: 10px;
}
</style>