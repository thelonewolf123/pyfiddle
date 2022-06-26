<template>
  <div class="home">
    <v-app dark>
      <v-app-bar app>
        <!-- -->
        <div class="header-text">PyCompiler.io</div>
      </v-app-bar>
      <!-- Sizes your content based upon application components -->
      <v-main>
        <!-- Provides the application the proper gutter -->
        <v-container fluid>
          <!-- If using vue-router -->
          <div class="home-body-section">
            <div class="about-section">
              <div class="about-header">About</div>
              <div class="about-body-section">
                <div class="single-line-about">
                  <div class="image-section">
                    <img
                      src="/img/assets/python-icon.png"
                      alt="python-icon"
                      class="image-icon python-icon"
                    />
                  </div>
                  Learn Python from scratch.
                </div>
                <div class="single-line-about">
                  <div class="image-section">
                    <img
                      src="/img/assets/easy-icon.png"
                      alt="python-icon"
                      class="image-icon"
                    />
                  </div>
                  Redefines interactive learning
                </div>
                <div class="single-line-about">
                  <div class="image-section">
                    <img
                      src="/img/assets/learn-icon.png"
                      alt="python-icon"
                      class="image-icon"
                    />
                  </div>
                  Designed with care for beginners
                </div>
              </div>
            </div>
            <div class="options-section">
              <div
                class="just-code coding-btn"
                @click="$router.push({ path: '/compiler' })"
              >
                Just Code
              </div>
              <div class="or-section">OR</div>
              <div class="learn-coding coding-btn">Learn Coding</div>
            </div>
          </div>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "HomeView",
};
</script>

<style>
.header-text {
  color: #fff;
}

.home-body-section {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
}

.learn-coding.coding-btn {
  background: red;
}

.just-code.coding-btn {
  background: green;
}

.about-header {
  font-weight: 700;
  font-size: 32px;
}
.options-section {
  display: flex;
}
.coding-btn {
  padding: 10px;
  margin: 5px;
  font-size: 20px;
  border-radius: 4px;
  width: 150px;
  cursor: pointer;
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-content: space-between;
}

.image-icon {
  height: 45px;
}
.python-icon {
  margin-left: -5px;
}
.image-section {
  width: 100px;
}

.or-section {
  display: flex;
  font-weight: 500;
  align-items: center;
  padding: 0px 20px;
}

.single-line-about {
  display: flex;
  align-items: center;
  padding: 15px 0px;
  font-size: 20px;
  font-weight: 500;
}
</style>
