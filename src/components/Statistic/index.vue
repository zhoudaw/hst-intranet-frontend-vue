<template>
  <div class="statistic">
    <div class="statistic-title" v-if="title">{{ title }}</div>
    <!-- <count-to
      :start-val="0"
      :end-val="value"
      :duration="2600"
      class="statistic-total"
    /> -->
    <div class="statistic-total">
      <span>{{ total[0] }}</span>
      <small class="decimal" v-if="total[1]">.{{ total[1] }}</small>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    value: {
      type: Number,
      default: 0
    },
    precision: Number
  },
  computed: {
    total() {
      if (this.precision === null) {
        return [this.value];
      }
      return (this.value || 0).toFixed(this.precision).split(".");
    }
  }
};
</script>
<style lang="scss" scoped>
.statistic {
  &-title {
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
  &-total {
    color: rgba(0, 0, 0, 0.85);
    font-size: 24px;
    .decimal {
      font-size: 16px;
    }
  }
}
</style>
