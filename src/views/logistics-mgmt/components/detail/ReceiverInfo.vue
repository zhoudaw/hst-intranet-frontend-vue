<template>
  <el-card shadow="never" class="mt1">
    <div slot="header">收件人信息</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="真实收件人:">
          {{ data.realReceiver || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="收件人电话:">
          {{ data.receiverPhone || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="收件人详细地址:">
          {{
            `${data.receiverProvince || ""}${data.receiverCity ||
              ""}${data.receiverArea || ""}${data.receiverDetailAddress ||
              ""}` || "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="收件人城市:">
          {{ data.receiverCity || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="申报人:">
          {{ data.declareUser || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="申报人身份证:">
          {{ data.declareUserIdCard || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="收件人国别:">
          {{
            data.receiverStateCode
              ? `${data.receiverState} (${data.receiverStateCode})`
              : "-"
          }}
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
