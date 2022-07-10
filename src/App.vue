<template>
  <div id="app">
    <div class="home">
      <v-app dark>
        <v-app-bar app>
          <!-- -->
          <div class="header-text">PyFiddle</div>
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

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
