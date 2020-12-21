<template>
  <el-card>
    <div slot="header">其它信息</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="关税付款人" prop="tariffPayName">
          <el-select
            v-model="form.tariffPayName"
            placeholder="请选择关税付款人"
            filterable
            style="width:100%"
          >
            <el-option
              v-for="v in tariffPayList"
              :key="v.value"
              :label="v.text"
              :value="v.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="是否正报" prop="normalOrSimple">
          <el-radio-group v-model="form.normalOrSimple">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <div style="line-height: normal;font-size:12px;color:#909399">
            单件超70KG或者2边同时超1.8米为正报，否则简报
          </div>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="客服" prop="customerServiceName">
          <el-select
            v-model="form.customerServiceName"
            placeholder="请选择请选择客服"
            filterable
            style="width:100%"
          >
            <el-option
              v-for="v in customerServiceList"
              :key="v.value"
              :label="v.text"
              :value="v.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="报关类型" prop="declarationCategoryCode">
          <el-select
            v-model="form.declarationCategoryCode"
            placeholder="请输入报关类型"
            filterable
            style="width:100%"
            @change="onDeclarationCategoryChange"
          >
            <el-option
              v-for="v in baseDeclarationCategoryList"
              :key="v.id"
              :label="v.code"
              :value="v.code"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" />
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="备注" prop="desc">
          <el-input
            type="textarea"
            v-model="form.desc"
            placeholder="请输入备注"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
const customerServiceList = [
  { text: "陈煜琳", value: 1 },
  { text: "许雅婷", value: 2 }
];
import { mapGetters } from "vuex";
import { tariffPayList } from "@/constants";
export default {
  data() {
    return {
      tariffPayList,
      customerServiceList,
      form: {
        tariffPayName: null,
        normalOrSimple: 0,
        customerServiceName: "许雅婷",
        declarationCategoryCode: "C",
        declarationCategory: null,
        desc: null
      },
      rules: {
        agencyFundNTD: [{ required: true, message: "请输入代收款(NTD)" }],
        tariffPayName: [{ required: true, message: "请选择关税付款人" }],
        customerServiceName: [{ required: true, message: "请选择客服" }],
        desc: [{ max: 150, message: "请输入150字以内的备注" }]
      }
    };
  },
  computed: {
    ...mapGetters("storageOrder", ["createData"]),
    baseDeclarationCategoryList() {
      const { baseDeclarationCategoryList } = this.createData || {};
      return baseDeclarationCategoryList || [];
    }
  },
  methods: {
    init(data) {
      Object.keys(this.form).forEach(k => {
        this.form[k] = data[k];
      });
    },
    onDeclarationCategoryChange(val) {
      let curr = this.baseDeclarationCategoryList.find(v => v.code === val);
      if (!curr) return;
      this.form.declarationCategory = curr.name;
    }
  }
};
</script>
