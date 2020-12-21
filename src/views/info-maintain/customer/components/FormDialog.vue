<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '客户名称'"
    :visible.sync="visible"
    :before-close="close"
    width="400px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入客户名称" />
      </el-form-item>
      <el-form-item label="客服" prop="customerService">
        <el-input v-model="form.customerService" placeholder="请输入客服名称" />
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
      form: {
        id: null,
        name: null,
        customerService: null
      },
      rules: {
        name: [
          { required: true, message: "请输入客户名称" },
          { max: 50, message: "请输入50字以内的客户名称" }
        ],
        customerService: [{ required: true, message: "请输入客服名称" }]
      },
      editing: false
    };
  },
  methods: {
    async show(editing = false, data) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key];
      });
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
          const { editing, form } = this;
          this.loading = true;
          await (editing ? api.update : api.create)(form);
          this.close();
          this.$message.closeAll();
          this.$message.success((editing ? "保存" : "添加") + "成功！");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
