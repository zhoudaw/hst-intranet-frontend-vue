<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '宅配段寄件人'"
    :visible.sync="visible"
    :before-close="close"
    width="400px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="寄件人名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入寄件人名称" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入电话" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { homeDeliverySender as api } from "@/api/info-maintain";
export default {
  data() {
    return {
      visible: false,
      form: {
        id: null,
        name: null,
        address: null,
        phone: null
      },
      rules: {
        name: [{ required: true, message: "请输入寄件人名称" }],
        address: [{ required: true, message: "请输入地址" }],
        phone: [
          { required: true, message: "请输入电话" },
          { pattern: /^[0-9\-、]+$/gi, message: "电话格式错误" }
        ]
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
