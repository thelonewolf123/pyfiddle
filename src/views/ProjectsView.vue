<template>
  <v-container>
    <h1>Projects</h1>
  </v-container>
</template>


<script>
export default {
  data() {
    return {
      projects: [
        {
          name: "hello, world",
          description: "Simple hello world program in python",
          author: "Harish kumar",
          createdTime: Date.now() - 100000,
          lastUpdated: Date.now(),
        },
      ],
    };
  },
};
</script>