<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-button
        type="primary"
        class="float-right"
        :disabled="loading"
        @click="showDialog"
      >
        暂 扣
      </el-button>
    </div>
    <empty v-if="!baseOrderBoxList.length" />
    <el-form v-else label-position="left" v-loading="loading">
      <box-item
        v-for="(v, i) in baseOrderBoxList"
        :key="v.id"
        :data="v"
        :index="i"
      />
    </el-form>
    <withhold-dialog ref="dialog" @refresh="getDetail" />
  </el-card>
</template>
<script>
import RouteLeave from "@/mixin/RouteLeave";
import api from "@/api/logistics-mgmt";
import BoxItem from "./components/BoxItem";
import WithholdDialog from "./components/WithholdDialog";
export default {
  name: "LogisticsMgmtWithholding",
  mixins: [RouteLeave],
  components: {
    BoxItem,
    WithholdDialog
  },
  data() {
    return {
      loading: false,
      detail: {}
    };
  },
  computed: {
    baseOrder() {
      const { baseOrder } = this.detail || {};
      return baseOrder || {};
    },
    baseOrderBoxList() {
      const { baseOrderBoxList } = this.baseOrder;
      return baseOrderBoxList || [];
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      try {
        this.loading = true;
        const { id } = this.$route.params;
        const { data } = await api.detail(id);
        this.detail = data || {};
      } finally {
        this.loading = false;
      }
    },
    showDialog() {
      let baseOrderGoodsList =
        [...this.baseOrderBoxList].pop().baseOrderGoodsList || [];
      this.$refs.dialog.show(baseOrderGoodsList);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item {
  margin-bottom: 0;
}
</style>
