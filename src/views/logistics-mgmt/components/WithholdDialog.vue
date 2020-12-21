<template>
  <el-dialog
    title="出口报关暂扣"
    :visible.sync="visible"
    :before-close="close"
    width="700px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="{ detainList }" label-position="top">
      <el-row :gutter="10" v-for="(v, i) in detainList" :key="v.id">
        <el-col :span="12">
          <el-form-item
            label="商品/物品名称"
            :prop="'detainList.' + i + '.hsName'"
          >
            <el-input
              v-model="v.hsName"
              placeholder="请输入商品/物品名称"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="申报数量"
            :prop="'detainList.' + i + '.detainQty'"
            :rules="[
              {
                type: 'integer',
                min: 0,
                max: v.declarationQty,
                message: '申报数量错误'
              }
            ]"
          >
            <el-input
              v-model.number="v.detainQty"
              :min="0"
              placeholder="请输入申报数量"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
import api from "@/api/logistics-mgmt";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      detainList: []
    };
  },
  methods: {
    async show(list = []) {
      this.detainList = list.map(v => ({
        ...v,
        detainQty: v.declarationQty || 0
      }));
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.detainList = [];
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;
          const { id } = this.$route.params;
          let query = {
            baseOrderId: id,
            detainList: this.detainList.map(v => ({
              id: v.id,
              detainQty: v.detainQty
            }))
          };
          await api.goodsDetention(query);
          this.$message.closeAll();
          this.$message.success("修改成功");
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
