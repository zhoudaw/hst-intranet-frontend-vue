<template>
  <el-card class="mt1" shadow="never">
    <el-form
      ref="form"
      class="expand-search-form"
      :model="form"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="创建日期" prop="aCreateDate">
            <el-date-picker
              v-model="form.aCreateDate"
              type="date"
              placeholder="选择日期"
              style="width:100%"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="入库日期" prop="aPutStorageDate">
            <el-date-picker
              v-model="form.aPutStorageDate"
              type="date"
              placeholder="选择日期"
              style="width:100%"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="客户名称" prop="aBaseCustomerIdList">
            <el-select
              v-model="form.aBaseCustomerIdList"
              placeholder="请选择客户名称"
              style="width:100%"
              filterable
              clearable
              multiple
            >
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="真实收件人" prop="aRealReceiver">
            <el-input
              v-model.trim="form.aRealReceiver"
              placeholder="请输入真实收件人"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="申报人" prop="aDeclareUser">
            <el-input
              v-model.trim="form.aDeclareUser"
              placeholder="请输入申报人"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="申报人身份证" prop="aDeclareUserIdCard">
            <el-input
              v-model.trim="form.aDeclareUserIdCard"
              placeholder="请输入申报人身份证"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="商品/物品名称" prop="aGoodsName">
            <el-input
              v-model.trim="form.aGoodsName"
              placeholder="请输入商品/物品名称"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="唛头" prop="aGoodsIdCode">
            <el-input
              v-model.trim="form.aGoodsIdCode"
              placeholder="请输入唛头"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="头程快递公司" prop="aExpressCompany">
            <el-input
              v-model.trim="form.aExpressCompany"
              placeholder="请输入头程快递公司"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="头程物流公司" prop="aLogistics">
            <el-input
              v-model.trim="form.aLogistics"
              placeholder="请输入头程物流公司"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="仓库状态" prop="aStatus">
            <el-select
              v-model="form.aStatus"
              placeholder="请选择仓库状态"
              style="width:100%"
              filterable
              clearable
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="备注" prop="aDesc">
            <el-input v-model.trim="form.aDesc" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="订单号" prop="aOrderId">
            <el-input
              type="textarea"
              v-model="form.aOrderId"
              placeholder="请输入订单号"
              :rows="3"
              @input="v => onInputChange('aOrderId', v)"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="头程物流单号" prop="aLogisticsNo">
            <el-input
              type="textarea"
              v-model="form.aLogisticsNo"
              placeholder="请输入头程物流单号"
              :rows="3"
              @input="v => onInputChange('aLogisticsNo', v)"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="头程快递单号" prop="aExpressNo">
            <el-input
              type="textarea"
              v-model="form.aExpressNo"
              placeholder="请输入头程快递单号"
              :rows="3"
              @input="v => onInputChange('aExpressNo', v)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="clearfix">
        <div class="float-right">
          <el-button type="primary" @click="onSubmit" :loading="loading">
            搜索
          </el-button>
          <el-button @click="onReset" :disabled="loading">重置</el-button>
          <el-button type="text" icon="el-icon-arrow-up" @click="onExpandClick">
            收起
          </el-button>
        </div>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import { mapGetters } from "vuex";
import { storageStatus } from "@/constants/order";
export default {
  inject: ["pQuery"],
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusList: storageStatus,
      form: {
        aCreateDate: null,
        aPutStorageDate: null,
        aBaseCustomerIdList: [],
        aRealReceiver: null,
        aDeclareUser: null,
        aDeclareUserIdCard: null,
        aGoodsName: null,
        aGoodsIdCode: null,
        aExpressCompany: null,
        aLogistics: null,
        aStatus: null,
        aDesc: null,
        aOrderId: null,
        aLogisticsNo: null,
        aExpressNo: null,
        aOrderIdList: [],
        aLogisticsNoList: [],
        aExpressNoList: []
      }
    };
  },
  computed: {
    ...mapGetters("baseCustomer", { customerList: "listAll" })
  },
  mounted() {
    this.$store.dispatch("baseCustomer/listAll");
  },
  methods: {
    onInputChange(k, v) {
      this.form[k + "List"] = (v || "").split("\n");
    },
    onExpandClick() {
      this.$emit("expand");
      // this.onReset();
    },
    onSubmit() {
      this.$emit("submit", this.form);
    },
    onReset() {
      this.$refs.form.resetFields();
      this.$emit("reset", this.form);
    }
  }
};
</script>
<style lang="scss" scoped>
.expand-search-form {
  /deep/ .el-form-item__label {
    padding-bottom: 0;
  }
}
</style>
