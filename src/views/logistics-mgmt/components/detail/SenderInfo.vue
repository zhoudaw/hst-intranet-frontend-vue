<template>
  <el-card shadow="never">
    <div slot="header">发件人信息</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="发件人:">
          {{ data.sender || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="发件人国别:">
          {{
            data.senderStateCode
              ? `${data.senderState} (${data.senderStateCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="发件人城市:">
          {{ data.senderCity || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="发件人地址:">
          {{
            `${data.senderProvince || ""}${data.senderCity ||
              ""}${data.senderArea || ""}${data.senderDetailAddress || ""}` ||
              "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="发件人电话:">
          {{ data.senderPhone || "-" }}
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
