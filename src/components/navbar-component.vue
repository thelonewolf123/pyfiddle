<template>
  <div>
    <v-app-bar app>
      <!-- -->
      <a class="header-text url" href="/">PyFiddle</a>
      <div class="url-links">
        <a class="url" href="/compiler">compiler</a>
        <a class="url" href="/about">about</a>
        <a class="url" v-if="!currentUser" href="/login">login</a>
        <a class="url" v-if="!currentUser" href="/signup">register</a>
        <a class="url" v-if="currentUser" href="/logout">logout</a>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["currentUser"]),
  },
};
</script>
