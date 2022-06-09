<template>
  <div class="file-titles">
    <div
      class="single-file-title"
      :key="index"
      v-for="(fileName, index) in files"
    >
      <div class="file-name-section">
        {{ fileName }}
      </div>
      <v-icon dark class="icon-x-mark"> fa-solid fa-xmark </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: {
      type: Array,
      required: true,
    },
  },
  mounted() {},
};
</script>

<style>
.file-titles {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid #333;
  height: 40px;
  background: #444;
}
.single-file-title {
  font-size: 1.2rem;
  font-weight: 400;
  color: aliceblue;
  padding: 0.5rem;
  background: #222;
}
.icon-x-mark {
  font-size: 0.9rem !important;
  cursor: pointer;
  padding-left: 10px;
}
.single-file-title {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}
</style>