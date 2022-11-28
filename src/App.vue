<template>
  <div id="app">
    <div class="home">
      <v-app dark>
        <navbarComponentVue v-if="showNavbar" />
        <!-- Sizes your content based upon application components -->
        <v-main>
          <!-- Provides the application the proper gutter -->
          <v-container fluid>
            <!-- If using vue-router -->
            <router-view></router-view>
          </v-container>
        </v-main>
      </v-app>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import navbarComponentVue from "@/components/navbar-component.vue";

export default {
  name: "HomeView",
  components: {
    navbarComponentVue,
  },
  computed: {
    showNavbar() {
      console.log(this.$route.path);
      if (this.$route.path !== "/compiler") return true;
      return false;
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.url-links {
  display: flex;
  width: 100%;
  justify-content: right;
  align-content: center;
  align-items: center;
}

.url {
  padding-left: 20px;
  text-decoration: none;
  color: gainsboro !important;
}

.w-100 {
  width: 100%;
}
</style>
