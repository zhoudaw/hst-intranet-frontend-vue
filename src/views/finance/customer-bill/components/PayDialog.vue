<template>
  <el-dialog
    title="支付"
    :visible.sync="visible"
    :before-close="close"
    width="700px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules" label-position="left">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="应收单号:" style="margin-bottom:0">
            {{ form.id || "-" }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="船名航次:" style="margin-bottom:0">
            {{ form.voy || "-" }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="票数:" style="margin-bottom:0">
            {{ form.shipmentNum || 0 }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户:" style="margin-bottom:0">
            {{ form.customerName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式(产品):" style="margin-bottom:0">
            {{ form.productName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="金额:" style="margin-bottom:0">
            {{ form.totalAmount || 0 }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付方式" prop="payType" label-width="80px">
            <el-select v-model="form.payType" placeholder="请选择支付方式">
              <el-option
                v-for="v in payTypeList"
                :key="v.value"
                :label="v.text"
                :value="v.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付金额" prop="payAmount" label-width="80px">
            <el-input-number
              v-model="form.payAmount"
              placeholder="请输入支付金额"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付流水号" prop="payNo" label-width="92px">
            <el-input v-model="form.payNo" placeholder="请输入支付流水号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="payDesc" label-width="40px">
            <el-input
              v-model="form.payDesc"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { payTypeList } from "@/constants";
import api from "@/api/customer-bill";
export default {
  data() {
    return {
      payTypeList,
      visible: false,
      loading: false,
      form: {
        id: null,
        customerCode: null,
        payAmount: null,
        payDesc: null,
        payNo: null,
        payType: null,
        productName: null,
        salesman: null,
        shipmentNum: 0,
        totalAmount: 0,
        voy: null
      },
      rules: {
        payType: [{ required: true, message: "请选择支付方式" }],
        payAmount: [{ required: true, message: "请输入支付金额" }],
        payNo: [{ required: true, message: "请输入请输入支付金额" }],
        payDesc: [{ max: 300, message: "请输入300字以内的描述" }]
      }
    };
  },
  methods: {
    async show(data = {}) {
      this.visible = true;
      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key];
      });
    },
    close() {
      this.visible = false;
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;
          await api.pay(this.form);
          this.close();
          this.$message.closeAll();
          this.$message.success("支付成功");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
