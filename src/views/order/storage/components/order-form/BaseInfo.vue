<template>
  <el-card>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="客户名称" prop="baseCustomerId">
          <el-select
            v-model="form.baseCustomerId"
            placeholder="请选择客户名称"
            filterable
            style="width:100%"
          >
            <el-option
              v-for="v in baseCustomerList"
              :key="v.id"
              :label="v.name"
              :value="v.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="头程物流公司" prop="logisticsName">
          <el-select
            v-model="form.logisticsName"
            placeholder="请选择头程物流公司"
            filterable
            style="width:100%"
            :disabled="form.customerAutoWayAble"
          >
            <el-option
              v-for="v in logisticsNameList"
              :key="v.id"
              :label="v.name"
              :value="v.name"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="头程物流单号" prop="logisticsNo">
          <el-input
            v-model="form.logisticsNo"
            placeholder="请输入头程物流单号"
            :disabled="form.customerAutoWayAble"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="头程快递公司" prop="expressCompany">
          <el-input
            v-model="form.expressCompany"
            placeholder="请输入头程快递公司"
            :disabled="form.customerAutoWayAble"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="头程快递单号" prop="expressNo">
          <el-input
            v-model="form.expressNo"
            placeholder="请输入头程快递单号"
            :disabled="form.customerAutoWayAble"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="宅配号" prop="homeDeliveryNo">
          <el-input v-model="form.homeDeliveryNo" placeholder="请输入宅配号" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="客户自送" prop="customerAutoWayAble">
          <el-switch v-model="form.customerAutoWayAble" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export const logisticsNameList = [
  { name: "厦门露润物流", id: 0 },
  { name: "厦门飓风物流", id: 1 },
  { name: "义乌福达物流", id: 2 },
  { name: "东莞鑫联运物流", id: 3 }
];
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      logisticsNameList,
      form: {
        baseCustomerId: null,
        logisticsName: null,
        logisticsNo: null,
        expressCompany: null,
        expressNo: null,
        homeDeliveryNo: null,
        customerAutoWayAble: false
      }
    };
  },
  computed: {
    ...mapGetters("storageOrder", ["createData"]),
    baseCustomerList() {
      const { baseCustomerList } = this.createData || {};
      return baseCustomerList || [];
    }
  },
  watch: {
    form: {
      handler(n) {
        this.$emit("change", n);
      },
      deep: true
    }
  },
  methods: {
    init(data) {
      Object.keys(this.form).forEach(k => {
        this.form[k] = data[k];
      });
    }
  }
};
</script>
