<template>
  <el-dialog
    title="C类套餐配置名"
    :visible.sync="visible"
    top="5vh"
    width="300px"
    :before-close="close"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form :model="{ name }" ref="form">
      <el-form-item
        prop="name"
        :rules="[{ required: true, message: '请输入套餐配置名' }]"
      >
        <el-input v-model="name" />
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
import { uuid } from "@/utils";
import api from "@/api/sell-product";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      name: null
    };
  },
  methods: {
    async show() {
      this.visible = true;
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

          const { productCode } = this.$route.params;
          let query = {
            name: this.name,
            planCode: uuid(),
            productCode
          };
          await api.planCreate(query);
          this.$message.success("新增成功!");
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
