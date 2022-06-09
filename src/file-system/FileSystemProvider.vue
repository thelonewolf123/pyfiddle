<script>

export default {
  data: () => ({
    fiels: [],
  }),
  created() {
    var fs = require("fs");
    fs.writeFile(
      "/test.txt",
      "Cool, I can do this in the browser!",
      function (err) {
        fs.readFile("/test.txt", function (err, contents) {
          console.log(contents.toString());
        });
      }
    );
  },
  render() {
    const slot = this.$scopedSlots.default({
      files: this.files,
    });

    return Array.isArray(slot) ? slot[0] : slot;
  },
};
</script>