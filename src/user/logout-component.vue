<script>
import { getAuth, signOut } from "firebase/auth";
import { mapActions } from "vuex";
export default {
  mounted() {
    const auth = getAuth();
    signOut(auth);
    alert("Successfully logged out!.");
    this.$router.push("/");
  },
  methods: {
    ...mapActions(["updateCurrentUser"], null),
  },
};
</script>