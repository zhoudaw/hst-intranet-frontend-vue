<template>
  <el-dialog
    title="包装种类"
    :visible.sync="visible"
    :before-close="close"
    width="350px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="包装种类" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入包装种类" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { packingType as api } from "@/api/info-maintain";
export default {
  data() {
    return {
      loading: false,
      visible: false,
      form: {
        id: null,
        name: null
      },
      rules: {
        name: [
          { required: true, message: "请输入包装种类" },
          { max: 50, message: "请输入50字以内的包装种类" }
        ]
      }
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.$refs.form.resetFields();
      this.form = this.$resetFields(this.form);
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;
          await api.create(this.form);
          this.close();
          this.$message.closeAll();
          this.$message.success("添加成功！");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
