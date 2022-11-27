<template>
  <div class="dep-list-view">
    <div class="dep-actions-bar">
      <div class="dep-label">Dependencies</div>
      <v-icon
        dark
        class="pointer icon-class"
        @click="showDepInput = !showDepInput"
      >
        fa-solid fa-circle-plus
      </v-icon>
    </div>
    <div class="package-input-section" v-if="showDepInput">
      <v-text-field
        v-model="packageName"
        @keydown.enter="addDependency"
        class="dependency-package-name-box"
        label="Package"
        dark
        flat
        solo
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
      <!-- <v-text-field
        v-model="version"
        class="dependency-version-box"
        label="Version"
        dark
        flat
        solo
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field> -->
    </div>
    <div class="dependency-list-section">
      <div
        class="single-dependency"
        v-for="(dep, index) in dependencies"
        :key="index"
      >
        <div class="dep-package-name">
          {{ dep.packageName }}
        </div>
        <div class="version-delete-section">
          <div class="dep-version">
            {{ dep.version }}
          </div>
          <span class="delete-icon">
            <v-icon
              dark
              class="pointer icon-class"
              @click="deleteDependency(index)"
            >
              fa-solid fa-trash
            </v-icon>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["dependencies"],
  data() {
    return {
      showDepInput: false,
      packageName: null,
      version: "latest",
    };
  },
  methods: {
    addDependency() {
      this.$emit("dependencyAdded", this.packageName, this.version);
      this.packageName = "";
      this.version = "latest";
      this.showDepInput = false;
    },
    deleteDependency(index) {
      const result = confirm(
        `Do you really want to delete ${this.dependencies[index].packageName}?`
      );

      if (!result) return;
      this.$emit("dependencyRemoved", index);
    },
  },
};
</script>

<style>
.dep-list-view {
  height: 50vh;
  width: 100%;
  background: #444;
  border-top: 4px solid #333;
}

.dep-actions-bar {
  background: #222;
  padding: 10px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dep-label {
  color: white;
  font-weight: 700;
  font-size: 16px;
}
.dependency-package-name-box {
  margin: 2px 5px !important;
  flex: 3;
}
.dependency-version-box {
  margin: 2px 5px !important;
  flex: 1;
}
.package-input-section {
  display: flex;
}
.single-dependency {
  color: #fff;
  display: flex;
  background: #333;
  padding: 10px;
  margin: 2px 0px;
  justify-content: space-between;
}
.dep-package-name,
.dep-version {
  padding: 5px;
}

.version-delete-section {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>