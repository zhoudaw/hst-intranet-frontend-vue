export default {
  data() {
    return {
      allowLeave: false
    };
  },
  mounted() {
    // window.addEventListener("beforeunload", this.onBeforeunload, false);
  },
  beforeDestroy() {
    // window.removeEventListener("beforeunload", this.onBeforeunload, false);
  },
  methods: {
    // beforeunload监听事件
    onBeforeunload(e) {
      e = e || window.event;
      let msg = "如果您现在刷新页面，填写的内容丢失，您确定要刷新？";
      // e.returnValue = '确定要关闭窗口吗？'
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = msg;
      }

      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      this.allowLeave = true;
      return msg;
    },
    async routeLeaveConfirm() {
      let confirm = await this.$confirm(
        "如果您现在离开，填写的内容丢失，您确定要离开？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => false);
      return confirm;
    }
  },
  async beforeRouteLeave(to, from, next) {
    if (to.name === "Login") {
      return next();
    }
    if (!this.allowLeave) {
      let confirm = await this.routeLeaveConfirm();
      if (!confirm) {
        return;
      }
    }
    this.$store.dispatch("tagsView/delView", from);
    next();
  }
};
