<template>
  <div>
    <order-form
      v-loading="loading"
      @submit="submit"
      @cancel="cancel"
      ref="form"
    />
  </div>
</template>

<script>
import OrderForm from "./components/OrderForm";
import RouteLeave from "../mixin/RouteLeave";
import { storage as api } from "@/api/order";
export default {
  name: "OrderStorageForm",
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
    const { name } = this.$route;
    let editing = name === "OrderStorageUpdate";
    editing && this.getDetail();
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
    async submit(form) {
      try {
        this.loading = true;
        const { name, params } = this.$route;
        let editing = name === "OrderStorageUpdate";
        await (editing ? api.update : api.create)({ ...form, id: params.id });
        this.allowLeave = true;
        this.$message.closeAll();
        this.$message.success((editing ? "更新" : "添加") + "成功！");
        this.$router.go(-1);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
