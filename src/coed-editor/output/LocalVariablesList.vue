<template>
  <div class="loacl-variables">

  </div>
</template>


<script>
export default {
  // props: ["localVariables"],
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
  data() {
    return {
      localVariables: {
        Adder: {
          value: "<class 'new.Adder'>",
          children: {},
        },
        adder: {
          value: "<new.Adder object at 0xb448c0>",
          children: {
            a: "4",
          },
        },
      },
    };
  },
};
</script>