<template>
  <div>
    <order-form
      ref="form"
      v-loading="loading"
      submit-text="保存本单，继续编辑"
      @submit="submit"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import OrderForm from "./components/OrderForm";
import RouteLeave from "../mixin/RouteLeave";
import { storage as api } from "@/api/order";
export default {
  name: "OrderStorageSplitFirst",
  mixins: [RouteLeave],
  components: {
    OrderForm
  },
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      try {
        this.loading = true;
        const { id } = this.$route.params;
        const { data } = await api.detail(id);
        const { baseOrder } = data || {};
        this.$nextTick(() => {
          this.$refs.form.init(baseOrder || {});
        });
      } finally {
        this.loading = false;
      }
    },
    async cancel() {
      let confirm = await this.routeLeaveConfirm();
      if (!confirm) return;
      this.allowLeave = true;
      this.$router.go(-1);
    },
    async submit({ baseOrderBoxList, ...form }) {
      try {
        this.loading = true;
        const { id } = this.$route.params;
        let query = { ...form, baseOrderId: id, commit: 0 };
        query.baseOrderBoxSplitFormList = baseOrderBoxList.map(
          ({ baseOrderGoodsList, ...box }) => {
            return {
              ...box,
              baseOrderGoodsSplitFormList: baseOrderGoodsList
            };
          }
        );
        const { data } = await api.actionSplit(query);
        this.allowLeave = true;
        this.$message.closeAll();
        this.$message.success("保存成功");
        this.$router.push({
          name: "OrderStorageSplitSecond",
          params: {
            prevId: id,
            id: data.newBaseOrderId
          },
          query: data.nextBaseOrder
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
