<template>
  <div class="loacl-variables"></div>
</template>


<script>
export default {
  props: ["localVariables"],
  watch: {
    localVariables: {
      handler(newVal) {
        console.log(newVal);
      },
      deep: true,
    },
  },
  mounted() {
    console.log(this.localVariables);
  },
};
</script>