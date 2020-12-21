<template>
  <el-card shadow="never" class="mt1">
    <div slot="header">货主信息</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="货主单位地区代码:">
          {{ data.ownerUnitAreaCode || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="货主单位代码:">
          {{ data.ownerUnitCode || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="货主单位统一社会信用代码:">
          {{ data.ownerNACAO || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="合同号:">
          {{ data.ownerContractNumber || "-" }}
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
