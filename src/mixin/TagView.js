export default {
  beforeRouteLeave(to, from, next) {
    console.log(1);
    this.$store.dispatch("tagsView/delView", from);
    next();
  }
};
