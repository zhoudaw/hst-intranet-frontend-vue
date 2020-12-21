<template>
  <el-card>
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-row :gutter="10">
        <el-col :sm="24" :md="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="公司名" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入公司名" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="营业执照" prop="businessLicense">
            <single-upload
              @success="file => onUploadSuccess('businessLicense', file)"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="营业执照" prop="roadTransportPermit">
            <single-upload
              @success="file => onUploadSuccess('roadTransportPermit', file)"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="24">
          <el-divider />
        </el-col>
        <el-col :sm="24" :md="10">
          <el-form-item label="省、市、县/区" prop="area">
            <el-cascader
              style="width:100%"
              v-model="form.area"
              placeholder="请输入省、市、县/区"
              :options="areaList"
              :props="areaProps"
              filterable
              ref="area"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="14">
          <el-form-item label="详细地址" prop="fullAddress">
            <el-input v-model="form.fullAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="经度" prop="longitude">
            <el-input-number
              v-model="form.longitude"
              style="width:100%"
              controls-position="right"
              placeholder="请输入经度"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="纬度" prop="latitude">
            <el-input-number
              v-model="form.latitude"
              style="width:100%"
              controls-position="right"
              placeholder="请输入纬度"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="btn-center">
        <el-button @click="reset">重 置</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import { phone, longitude, latitude } from "@/utils/pattern";
import api from "@/api/logistics";
import SingleUpload from "@/components/SingleUpload";
import { chinaArea } from "@/constants";
import RouteLeave from "@/mixin/RouteLeave";

export default {
  name: "LogisticsForm",
  mixins: [RouteLeave],
  components: {
    SingleUpload
  },
  data() {
    return {
      areaList: chinaArea,
      areaProps: {
        value: "id",
        label: "name"
      },
      form: {
        phone: null,
        email: null,
        companyName: null,
        area: [],
        provinceId: null,
        cityId: null,
        areaId: null,
        provinceName: null,
        cityName: null,
        areaName: null,
        fullAddress: null,
        contact: null,
        contactNumber: null,
        longitude: null,
        latitude: null,
        businessLicense: null,
        roadTransportPermit: null
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号" },
          { pattern: phone, message: "手机号格式错误" }
        ],
        email: [
          { required: true, message: "请输入邮箱" },
          { type: "email", message: "邮箱格式错误" }
        ],
        companyName: [{ required: true, message: "请输入公司名" }],
        area: [{ required: true, message: "省、市、县/区不能为空" }],
        fullAddress: [{ required: true, message: "详细地址是不能为空" }],
        contact: [{ required: true, message: "请输入联系人" }],
        contactNumber: [
          { required: true, message: "请输入联系方式" },
          { pattern: /^[0-9_\-、]+$/gi, message: "联系方式格式错误" }
        ],
        longitude: [
          { required: true, message: "请输入经度" },
          { pattern: longitude, message: "经度格式错误" }
        ],
        latitude: [
          { required: true, message: "请输入纬度" },
          { pattern: latitude, message: "纬度格式错误" }
        ],
        businessLicense: [{ required: true, message: "请上传营业执照" }],
        roadTransportPermit: [
          { required: true, message: "请上传道路运输许可证" }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        const { path, params } = this.$route;
        if (!path.includes("update")) return;
        this.loading = true;
        const { data } = await api.detail(params.id);
        Object.keys(this.form).forEach(key => {
          this.form[key] = data[key];
        });
        const { provinceId, cityId, areaId } = data;
        this.form.area = [provinceId, cityId, areaId];
      } finally {
        this.loading = false;
      }
    },
    onUploadSuccess(key, file) {
      this.form[key] = file.name;
      this.$refs.form.validateField(key);
    },
    reset() {
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          const { editing, form } = this;
          let areaNodes = this.$refs.area.getCheckedNodes(true);
          let [province, city, area] = areaNodes[0].pathNodes;
          this.loading = true;
          let newForm = {
            ...form,
            provinceName: province.label,
            cityName: city.label,
            areaName: area.label,
            provinceId: province.value,
            cityId: city.value,
            areaId: area.value
          };
          await (editing ? api.update : api.create)(newForm);
          this.close();
          this.$message.closeAll();
          this.$message.success((editing ? "保存" : "添加") + "成功！");
          this.$router.go(-1);
        } finally {
          this.loading = false;
        }
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
