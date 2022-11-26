<template>
  <div id="app">
    <div class="home">
      <v-app dark>
        <v-app-bar app>
          <!-- -->
          <a class="header-text url" href="/">PyFiddle</a>
          <div class="url-links">
            <a class="url" href="/compiler">compiler</a>
            <a class="url" href="/about">about</a>
            <a class="url" v-if="!isUserSignedIn" href="/login">login</a>
            <a class="url" v-if="!isUserSignedIn" href="/signup">register</a>
            <a class="url" v-if="isUserSignedIn" href="/logout">logout</a>
          </div>
        </v-app-bar>
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
import { getAuth } from "firebase/auth";
export default {
  computed: {
    isUserSignedIn() {
      const auth = getAuth();

      return auth.currentUser ? true : false;
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
</style>
