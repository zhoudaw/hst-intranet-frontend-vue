<template>
  <div>
    <order-form
      ref="form"
      v-loading="loading"
      cancel-text="上一步"
      submit-text="保 存"
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
  name: "OrderStorageSplitSecond",
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
        const { params } = this.$route;
        const { id } = params;
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
        const { prevId, id } = this.$route.params;
        let query = { ...form, baseOrderId: id, previousId: prevId, commit: 1 };
        query.baseOrderBoxSplitFormList = baseOrderBoxList.map(
          ({ baseOrderGoodsList, ...box }) => {
            return {
              ...box,
              baseOrderGoodsSplitFormList: baseOrderGoodsList
            };
          }
        );
        await api.actionSplit(query);
        this.allowLeave = true;
        this.$message.closeAll();
        this.$message.success("拆单成功");
        this.$router.push({ name: "OrderStorage" });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
