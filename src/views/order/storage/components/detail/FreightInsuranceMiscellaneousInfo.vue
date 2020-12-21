<template>
  <el-card shadow="never" class="mt1">
    <div slot="header">运费、保险费、杂费信息</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="运费标记:">
          {{ data.freightMark || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="运费币制:">
          {{
            data.freightCurrencyCode
              ? `${data.freightCurrency} (${data.freightCurrencyCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="运费/率:">
          {{ data.freightRate || 0 }}
        </el-form-item>
      </el-col>
      <el-col :span="24" />
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="保险费标记:">
          {{ data.insuranceMark || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="保险费币制:">
          {{
            data.insuranceCurrencyCode
              ? `${data.insuranceCurrency} (${data.insuranceCurrencyCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="保险费/率:">
          {{ data.insuranceRate || 0 }}
        </el-form-item>
      </el-col>
      <el-col :span="24" />
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="杂费标记:">
          {{ data.incidentalsMark || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="杂费币制:">
          {{
            data.incidentalsCurrencyCode
              ? `${data.incidentalsCurrency} (${data.incidentalsCurrencyCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="杂费/率:">
          {{ data.incidentalsRate || 0 }}
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
