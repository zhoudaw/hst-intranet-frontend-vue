<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '客户'"
    :visible.sync="visible"
    :before-close="close"
    width="650px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="客户名称" prop="nickname">
            <el-input
              v-model.trim="form.nickname"
              placeholder="请输入客户名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!editing">
          <el-form-item label="用户账号" prop="account">
            <el-input v-model.trim="form.account" placeholder="请输入账号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="form.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户类型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择客户类型"
              style="width:100%"
              filterable
            >
              <el-option
                v-for="v in typeList"
                :key="v.value"
                :label="v.text"
                :value="v.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务员" prop="salesman">
            <el-select
              v-model="form.salesman"
              placeholder="请选择业务员"
              style="width:100%"
              filterable
            >
              <el-option
                v-for="(v, i) in salesmanList"
                :key="i"
                :label="v"
                :value="v"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客服" prop="customerService">
            <el-select
              v-model="form.customerService"
              placeholder="请选择客服"
              style="width:100%"
              filterable
            >
              <el-option
                v-for="(v, i) in customerServiceList"
                :key="i"
                :label="v"
                :value="v"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结算模式" prop="settleAccountsMode">
            <el-select
              v-model="form.settleAccountsMode"
              placeholder="请选择客户类型"
              style="width:100%"
              filterable
              @change="settleAccountsModeChange"
            >
              <el-option
                v-for="v in settlementModeList"
                :key="v.value"
                :label="v.text"
                :value="v.value"
              />
            </el-select>
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
import api from "@/api/customer";
import { typeList, settlementModeList } from "@/constants/customer";
import { lowOrInt, phone } from "@/utils/pattern";
import debounce from "@/utils/debounce";
import { mapGetters } from "vuex";
export default {
  data() {
    const validatorNickname = (rule, value, callback) => {
      if (!value) return callback("请输入客户名称");
      if (value === this.detail.nickname) return callback();
      this.checkName(value, callback);
    };
    const validatorAccount = (rule, value, callback) => {
      if (!value) return callback("请输入用户账号");
      if (!lowOrInt.test(value)) return callback("用户账号格式错误");
      if (value === this.detail.account) return callback();
      this.checkAccount(value, callback);
    };
    const validatorPhone = (rule, value, callback) => {
      if (!value) return callback("请输入手机号");
      if (!phone.test(value)) return callback("手机号格式错误");
      if (value === this.detail.phone) return callback();
      this.checkPhone(value, callback);
    };
    return {
      typeList,
      settlementModeList,
      visible: false,
      loading: false,
      editing: false,
      detail: {
        nickname: null,
        account: null,
        phone: null,
        email: null
      },
      form: {
        id: null,
        nickname: null,
        account: null,
        phone: null,
        email: null,
        type: null,
        salesman: null,
        customerService: null,
        feeOfYkg: null,
        pricePerKg: null,
        settleAccountsMode: null,
        settleAccountsModeName: null
      },
      rules: {
        nickname: [{ required: true, validator: validatorNickname }],
        account: [{ required: true, validator: validatorAccount }],
        phone: [{ required: true, validator: validatorPhone }],
        email: [
          {
            required: false,
            validator: async (rule, value, callback) => {
              if (!value) return callback();
              if (value === this.detail.email) return callback();
              this.checkPhone(value, callback);
            }
          },
          { type: "email", message: "邮箱格式错误" }
        ],
        type: [{ required: true, message: "请选择客户类型" }],
        salesman: [{ required: true, message: "请选择业务员" }],
        customerService: [{ required: true, message: "请选择客服" }],
        settleAccountsMode: [{ required: true, message: "请选择结算模式" }]
      }
    };
  },
  computed: {
    ...mapGetters("customer", ["customerServiceList", "salesmanList"])
  },
  methods: {
    async show(editing = false, data = {}) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      this.detail = data;
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
          const { editing, form } = this;
          this.loading = true;
          await (editing ? api.update : api.create)(form);
          this.close();
          this.$message.closeAll();
          this.$message.success((editing ? "保存" : "添加") + "成功！");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    },
    checkName: debounce(async function(value, callback) {
      try {
        const { data } = await api.checkName(value);
        if (data.response) {
          return callback("系统中已存在此名称");
        }
        callback();
      } catch (e) {
        callback("系统异常");
      }
    }, 300),
    checkAccount: debounce(async function(value, callback) {
      try {
        const { data } = await api.checkAccount(value);
        if (data.response) {
          return callback("此用户账号已被使用");
        }
        callback();
      } catch (e) {
        callback(e.message || "系统异常");
      }
    }, 300),
    checkPhone: debounce(async function(value, callback) {
      try {
        const { data } = await api.checkPhone(value);
        if (data.response) {
          return callback("此手机号码已被使用");
        }
        callback();
      } catch (e) {
        callback("系统异常");
      }
    }, 300),
    checkEmail: debounce(async function(value, callback) {
      try {
        const { data } = await api.checkEmail(value);
        if (data.response) {
          return callback("此邮箱已被使用");
        }
        callback();
      } catch (e) {
        callback("系统异常");
      }
    }, 300),
    settleAccountsModeChange(v) {
      let curr = settlementModeList.find(item => item.value === v);
      if (!curr) return;
      this.form.settleAccountsModeName = curr.text;
    }
  }
};
</script>
