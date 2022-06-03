<template>
  <div class="sidebar-view">
    <files-tree-vue @activeItemChanged="activeItemChanged"></files-tree-vue>
  </div>
</template>

<script>
import FilesTreeVue from "./side-bar/FilesTree.vue";
export default {
  components: {
    FilesTreeVue,
  },
  methods: {
    activeItemChanged(item) {
      this.$emit("activeItemChanged", item);
    },
  },
};
</script>


<style>
.sidebar-view {
  border-right: 5px solid #333;
}
</style>