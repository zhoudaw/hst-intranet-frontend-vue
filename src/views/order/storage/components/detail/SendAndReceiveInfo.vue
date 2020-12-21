<template>
  <el-card shadow="never" class="mt1">
    <div slot="header">收发件信息</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="收发货人名称:">
          {{ data.sendReceiveName || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="收发货人代码:">
          {{ data.sendReceiveCode || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="收发件人证件类型:">
          {{ data.sendReceiveCardType || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="收发件人证件号:">
          {{ data.sendReceiveCardNum || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="收发货人统一社会信用代码:">
          {{ data.sendReceiveNACAO || "-" }}
        </el-form-item>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
