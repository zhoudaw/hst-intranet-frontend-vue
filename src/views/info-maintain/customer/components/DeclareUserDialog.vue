<template>
  <el-dialog
    title="申报人及其身份证"
    :visible.sync="visible"
    :before-close="close"
    width="600px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form">
      <el-form-item>
        <p>格式为：申报人-申报人身份证,输入多个请以英文状态下的逗号隔开</p>
        <el-input
          v-model="form.declareUserListStr"
          type="textarea"
          :rows="10"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { customer as api } from "@/api/info-maintain";
export default {
  data() {
    return {
      visible: false,
      editing: false,
      form: {
        id: null,
        declareUserListStr: null
      }
    };
  },
  methods: {
    async show(data) {
      this.visible = true;
      this.form = { ...data };
    },
    close() {
      this.visible = false;
      this.detail = {};
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          const { form } = this;
          this.loading = true;
          await api.update(form);
          this.close();
          this.$message.closeAll();
          this.$message.success("保存成功！");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
