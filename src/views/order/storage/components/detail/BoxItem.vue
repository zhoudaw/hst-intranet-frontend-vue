<template>
  <el-card shadow="never" class="mt1">
    <div slot="header">箱{{ index + 1 }}</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="包装种类:">
          {{ data.kindOfPackage || "-" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="长CM:">
          {{ data.boxLength || 0 }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="宽CM:">
          {{ data.boxWidth || 0 }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="高CM:">
          {{ data.boxHeight || 0 }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="件数(按包装计算):">
          {{ data.boxQty || 0 }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="总毛重KG(总件数):">
          {{ data.grossWeight || 0 }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="总净重KG(总件数):">
          {{ data.netWeight || 0 }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="内物总数量(总件数):">
          {{ data.totalQty || 0 }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="是否含木质包装:">
          {{ data.woodPackage === 1 ? "是" : "否" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="是否为旧物品:">
          {{ data.oldGoods === 1 ? "是" : "否" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="是否为低温运输:">
          {{ data.lowTemperature === 1 ? "是" : "否" }}
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="唛头(外包装标识):">
          {{ data.expressNo || "-" }}
        </el-form-item>
      </el-col>
    </el-row>
    <el-table
      :data="data.baseOrderGoodsList || []"
      style="width: 100%"
      class="mt1"
      max-height="500"
      ref="table"
    >
      <el-table-column prop="hsName" label="商品/物品名称" min-width="200" />
      <el-table-column prop="hsCode" label="商品编码" width="150" />
      <el-table-column
        prop="declarationUnit"
        label="申报计量单位"
        width="100"
      />
      <el-table-column
        prop="specifications"
        label="商品规格/型号"
        min-width="150"
      />
      <el-table-column prop="declarationQty" label="总申报数量" width="150" />
      <el-table-column prop="price" label="单价" min-width="100" />
      <el-table-column prop="brand" label="品牌" min-width="150" />
      <el-table-column
        prop="singleWeight"
        label="单品类重量KG"
        min-width="120"
      />
      <el-table-column prop="totalPrice" label="总价" min-width="100" />
    </el-table>
  </el-card>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    }
  }
};
</script>
