<template>
  <div class="empty" v-if="visible">
    <i :class="iconClass" />
    <div class="empty-text">{{ text }}</div>
  </div>
</template>
<script>
export default {
  name: "Empty",
  data() {
    return {};
  },
  props: {
    text: {
      type: String,
      default: "No Data"
    },
    visible: {
      type: Boolean,
      default: true
    },
    iconClass: {
      type: String,
      default: "el-icon-folder-opened"
    }
  }
};
</script>
<style lang="scss" scoped>
.empty {
  padding: 8px 0;
  color: #cecece;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1;
  i {
    font-size: 35px;
    margin-bottom: 10px;
    display: inline-block;
  }
  &-text {
    // color: #909399;
    font-size: 14px;
    font-weight: normal;
    line-height: 1;
  }
}
</style>
