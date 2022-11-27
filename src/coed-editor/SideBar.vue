<template>
  <div class="sidebar-view">
    <files-tree-vue></files-tree-vue>
    <dependency-list-vue
      @dependencyAdded="dependencyAdded"
      @dependencyRemoved="dependencyRemoved"
      :dependencies="dependencies"
    ></dependency-list-vue>
  </div>
</template>

<script>
import FilesTreeVue from "./side-bar/FilesTree.vue";
import DependencyListVue from "./side-bar/DependencyList.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    FilesTreeVue,
    DependencyListVue,
  },
  computed: {
    ...mapGetters(["getDependencies"]),
    dependencies() {
      return this.getDependencies;
    },
  },
  methods: {
    ...mapActions(["addPyDependency", "removePyDependency"]),
    dependencyAdded(packageName, version) {
      console.log(packageName, version);
      this.addPyDependency({
        version: version,
        packageName: packageName,
      });
    },
    dependencyRemoved(index) {
      this.removePyDependency(index);
    },
  },
};
</script>


<style>
.sidebar-view {
  border-right: 5px solid #333;
}
</style>