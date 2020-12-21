<template>
  <el-dialog
    title="移至提单"
    :visible.sync="visible"
    :before-close="close"
    width="400px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules" v-loading="loading">
      <el-form-item prop="billsOfLadingNo">
        <el-select
          v-model="form.billsOfLadingNo"
          placeholder="请选择提单号"
          filterable
          style="width:100%"
        >
          <el-option
            v-for="v in blList"
            :key="v.id"
            :label="`${v.billsOfLadingNo}-${formatDate(v.startSailDate)}`"
            :value="v.billsOfLadingNo"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { storage as api } from "@/api/order";
import { formatDate } from "@/utils";

export default {
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        billsOfLadingNo: null,
        idList: []
      },
      rules: {
        billsOfLadingNo: [{ required: true, message: "请选择提单号" }]
      }
    };
  },
  computed: {
    ...mapGetters("bl", { blList: "listAll" })
  },
  mounted() {
    this.$store.dispatch("bl/listAll");
  },
  methods: {
    formatDate,
    show(idList = []) {
      this.visible = true;
      this.form.idList = idList;
    },
    close() {
      this.visible = false;
      this.$refs.form.resetFields();
      this.form = this.$resetFields(this.form);
      this.$emit("close");
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;
          await api.toBillsOfLading(this.form);
          this.$message.success("移入提单成功");
          this.$emit("refresh");
          this.close();
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
