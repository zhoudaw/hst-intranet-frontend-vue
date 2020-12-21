<template>
  <el-form ref="form" :model="form" :rules="rules" label-position="top">
    <base-info ref="base" @change="onChange" class="mb1" />
    <sender-info ref="sender" @change="onChange" class="mb1" />
    <receiver-info ref="receiver" @change="onChange" class="mb1" />
    <box-items ref="box" @change="onChange" />
    <other-info ref="other" class="mb1" />
    <el-card>
      <div class="btn-center">
        <el-button size="small" @click="cancel">{{ cancelText }}</el-button>
        <el-button size="small" type="primary" @click="submit">
          {{ submitText }}
        </el-button>
      </div>
    </el-card>
  </el-form>
</template>
<script>
import {
  BaseInfo,
  SenderInfo,
  ReceiverInfo,
  BoxItems,
  OtherInfo
} from "./order-form";
export default {
  name: "OrderForm",
  components: {
    BaseInfo,
    SenderInfo,
    ReceiverInfo,
    BoxItems,
    OtherInfo
  },
  props: {
    cancelText: {
      type: String,
      default: "取 消"
    },
    submitText: {
      type: String,
      default: "确 定"
    }
  },
  data() {
    return {
      form: {
        baseCustomerId: null,
        logisticsName: null,
        logisticsNo: null,
        expressCompany: null,
        expressNo: null,
        homeDeliveryNo: null,
        customerAutoWayAble: false,
        baseSenderId: null,
        sender: null,
        realReceiver: null,
        receiverPhone: null,
        receiverAreas: [],
        receiverAddressIds: null,
        receiverProvince: null,
        receiverCity: null,
        receiverArea: null,
        receiverDetailAddress: null,
        declareUserKey: null,
        declareUser: null,
        declareUserIdCard: null,
        declareUserListJson: null,
        baseOrderBoxList: [],
        tariffPayName: null,
        normalOrSimple: 0,
        customerServiceName: "许雅婷",
        declarationCategoryCode: "C",
        declarationCategory: null,
        desc: null
      },
      rules: {
        // 基本字段
        // baseCustomerId: [{ required: true, message: "请输入客户名称" }],
        // logisticsNo: [{ pattern: /\w+$/, message: "物流单号格式错误" }],
        // expressNo: [{ pattern: /\w+$/, message: "物流单号格式错误" }],
        // logisticsName: [{ required: true, message: "请输入物流公司" }],
        // expressCompany: [{ required: true, message: "请输入快递公司" }]
        // 发件人信息
        // baseSenderId: [{ required: true, message: "请选择发件人" }],
        // englishSenderName: [
        //   { required: true, message: "请输入英文发件人" },
        //   { pattern: /\w+$/, message: "英文发件人格式错误" }
        // ],
        // senderStateCode: [{ required: true, message: "请选择发件人国别" }],
        // senderCity: [{ required: true, message: "请输入发件人城市" }],
        // // englishSenderCity: [{ required: true, message: '请输入英文发件人城市' }],
        // englishSenderStopCity: [
        //   { pattern: /\w+$/, message: "英文经停城市格式错误" }
        // ],
        // senderAddressIds: [{ required: true, message: "请选择发件人地址" }],
        // senderDetailAddress: [
        //   { required: true, message: "详细地址是不能为空" }
        // ],
        // englishSenderFullAddress: [
        //   { pattern: /\w+$/, message: "英文发件人地址格式错误" }
        // ],
        // senderPhone: [
        //   { required: true, message: "请输入发件人电话" },
        //   { pattern: /^[0-9\-/|]+$/gi, message: "发件人电话格式错误" }
        // ]
        // 收件人信息
        // declareUserList: [
        //   { required: true, message: "请输入申报人及申报人身份证" }
        // ],
        // englishReceiver: [
        //   // { required: true, message: '请输入英文收件人' },
        //   { pattern: /\w+$/, message: "英文收件人格式错误" }
        // ],
        // receiverIdCard: [
        //   // { required: true, message: '请输入统编' },
        //   { pattern: /\w+$/, message: "统编格式错误" }
        // ],
        // realReceiver: [{ required: true, message: "请输入真实收件人" }],
        // receiverStateCode: [{ required: true, message: "请选择收件人国别" }],
        // receiverCity: [{ required: true, message: "请输入收件人城市" }],
        // receiverAddressIds: [{ required: true, message: "请选择收件人地址" }],
        // receiverDetailAddress: [
        //   { required: true, message: "详细地址是不能为空" }
        // ],
        // englishReceiverFullAddress: [
        //   // { required: true, message: '请输入英文收件人地址' },
        //   { pattern: /\w+$/, message: "英文收件人地址格式错误" }
        // ],
        // receiverPhone: [
        //   // { required: true, message: '请输入收件人电话' },
        //   { pattern: /^(09\d{8})|\d{8}$/gi, message: "收件人电话格式错误" }
        // ]
      }
    };
  },
  mounted() {
    this.$store.dispatch("storageOrder/createData");
  },
  methods: {
    init(data) {
      const refs = ["base", "sender", "receiver", "box", "other"];
      this.$nextTick(() => {
        for (let ref of refs) {
          this.$refs[ref].init(data);
        }
      });
    },
    onChange(form) {
      this.form = { ...this.form, ...form };
    },
    cancel() {
      this.$refs.form.resetFields();
      this.$emit("cancel");
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        this.$emit("submit", this.form);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-center {
  display: flex;
  justify-content: center;
}
</style>
