<template>
  <div>
    <order-form
      ref="form"
      v-loading="loading"
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
  name: "OrderStorageMergeUpdate",
  mixins: [RouteLeave],
  components: {
    OrderForm
  },
  data() {
    return {
      loading: false
    };
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
        const { baseOrder } = data || {};
        this.$refs.form.init(baseOrder || {});
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
    async submit(form) {
      try {
        this.loading = true;
        const { params } = this.$route;
        await api.update({ ...form, id: params.id });
        this.allowLeave = true;
        this.$message.closeAll();
        this.$message.success("更新成功！");
        this.$router.push({ name: "OrderStorage" });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
