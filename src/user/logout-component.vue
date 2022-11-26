<script>
import { getAuth, signOut } from "firebase/auth";
export default {
  mounted() {
    const auth = getAuth();
    signOut(auth);
    alert("Successfully logged out!.");
    this.$router.push("/");
  },
};
</script>