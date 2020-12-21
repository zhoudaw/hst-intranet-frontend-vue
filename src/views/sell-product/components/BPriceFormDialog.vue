<template>
  <el-dialog
    title="B类基础价格配置编辑"
    :visible.sync="visible"
    width="400px"
    top="5vh"
    :before-close="close"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="价格" prop="price">
        <el-input-number
          v-model="form.price"
          placeholder="请输入支付金额"
          style="width:100%"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input
          v-model="form.desc"
          type="textarea"
          :rows="3"
          placeholder="请输入备注"
        />
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
import debounce from "@/utils/debounce";
import api from "@/api/sell-product";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        id: null,
        price: null,
        desc: null
      },
      rules: {
        price: [{ required: true, message: "请输入支付金额" }],
        desc: [{ max: 300, message: "请输入300字以内的描述" }]
      }
    };
  },
  methods: {
    async show(data = {}) {
      this.visible = true;
      this.form = { ...data };
    },
    close() {
      this.visible = false;
      this.$refs.form.resetFields();
    },
    submit: debounce(function() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;
          await api.putPlanBConfig(this.form);
          this.$message.success("保存成功!");
          this.close();
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }, 200)
  }
};
</script>
