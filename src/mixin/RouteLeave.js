export default {
  async beforeRouteLeave(to, from, next) {
    if (to.name === "Login") {
      return next();
    }
    this.$store.dispatch("tagsView/delView", from);
    next();
  }
};
