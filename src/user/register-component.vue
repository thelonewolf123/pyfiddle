<template>
  <div class="register-section">
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Register form</v-toolbar-title>
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
          <v-btn color="primary" @click="register" class="w-100">
            Register
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
        <div class="social-login">
          <google-login-component text="Register" />
        </div>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
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
    async register() {
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        alert("Successfully registered! Please login.");
        this.$router.push("/login");
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>


<style scoped>
.register-section {
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