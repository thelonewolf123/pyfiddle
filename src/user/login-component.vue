<template>
  <div class="login-section">
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Login form</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              prepend-icon="fa-solid fa-user"
              name="login"
              label="Login"
              type="text"
              v-model="email"
            ></v-text-field>
            <v-text-field
              id="password"
              prepend-icon="fa-solid fa-lock"
              name="password"
              label="Password"
              type="password"
              v-model="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="login" class="w-100">Login</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
        <div class="social-login">
          <google-login-component text="Login" />
        </div>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import googleLoginComponent from "./google-login-btn.vue";
export default {
  components: {
    googleLoginComponent,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, this.email, this.password);
        alert("Successfully logged in");
        this.$router.push("/");
      } catch (err) {
        alert(err.message);
      }
    },
  },
};
</script>

<style scoped>
.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
}

.social-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
</style>