<template>
  <el-card shadow="never" class="mt1">
    <div slot="header">报关信息</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="报关类别:">
          {{
            data.declarationCategoryCode
              ? `${data.declarationCategory} (${data.declarationCategoryCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="币制:">
          {{
            data.currencyCode
              ? `${data.currencyName} (${data.currencyCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="监管方式:">
          {{
            data.superviseWayCode
              ? `${data.superviseWay} (${data.superviseWayCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="征免性质分类:">
          {{
            data.levyExemptionCategoryCode
              ? `${data.levyExemptionCategory} (${data.levyExemptionCategoryCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="成交方式:">
          {{ data.completedWay || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="申报单位类别:">
          {{ data.declarationUnitCategory || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="征减免税方式:">
          {{ data.levyExemptionWay || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="码头/货场代码:">
          {{ data.pierName || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="贸易国别:">
          {{
            data.tradeStateCode
              ? `${data.tradeStateName} (${data.tradeStateCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="产销国:">
          {{
            data.productStateCode
              ? `${data.productStateName} (${data.productStateCode})`
              : "-"
          }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="产销城市:">
          {{ data.productCityName || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="生产厂商:">
          {{ data.factory || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="用途:">
          {{ data.use || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="第二数量:">
          {{ data.secondQty || 0 }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="第二计量单位:">
          {{ data.secondUnit || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="关联编号字段:">
          {{ data.contactNo || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="备注:">
          {{ data.desc || "-" }}
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
