<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$nextTick(() => {
      const loading = document.querySelector(".loading-container");
      // addClass(loadingDom, "opacity5");
      // addClass(loadingDom, "hide");
      document.body.removeChild(loading);
    });
  }
};
</script>
