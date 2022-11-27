<template>
  <div class="ide-nav-bar">
    <v-navigation-drawer v-model="sidebar" app class="menu-tiles">
      <v-list dense>
        <h2>Menu</h2>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item
            v-for="(item, i) in menuItems"
            :key="i"
            @click="menuItemClicked(item.title)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
    <div>Title</div>
  </div>
</template>
<script>
// reference => https://microsoft.github.io/vscode-codicons/dist/codicon.html

export default {
  data() {
    return {
      sidebar: false,
      selectedItem: null,
      menuItems: [
        { title: "Home", path: "/", icon: "codicon codicon-home" },
        {
          title: "New Project",
          path: "/new-project",
          icon: "codicon codicon-add",
        },
        {
          title: "Fork Project",
          path: "/fork-project",
          icon: "codicon codicon-source-control",
        },
      ],
    };
  },
  methods: {
    menuItemClicked(menuTitle) {
      console.log(menuTitle);
      this.selectedItem = null;
      this.sidebar = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.ide-nav-bar {
  height: 35px;
  background: #333;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.menu-tiles {
  display: flex;
  flex-direction: column;
}
</style>