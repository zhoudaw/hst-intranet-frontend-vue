<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '仓库'"
    :visible.sync="visible"
    :before-close="close"
    width="700px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="仓库名称" prop="name">
            <el-input v-model.trim="form.name" placeholder="请输入仓库名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库位数" prop="siteTotal">
            <el-input
              v-model.number="form.siteTotal"
              placeholder="请输入仓库位数"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="16">
          <el-form-item label="详细地址" prop="fullAddress">
            <el-input v-model="form.fullAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model.trim="form.contact" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="contactNumber">
            <el-input
              v-model.trim="form.contactNumber"
              placeholder="请输入联系方式"
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
import api from "@/api/warehouse";
import { chinaArea } from "@/constants";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      areaList: chinaArea,
      areaProps: {
        value: "id",
        label: "name"
      },
      form: {
        id: null,
        name: null,
        siteTotal: null,
        area: [],
        provinceId: null,
        cityId: null,
        areaId: null,
        provinceName: null,
        cityName: null,
        areaName: null,
        fullAddress: null,
        contact: null,
        contactNumber: null
      },
      rules: {
        name: [
          { required: true, message: "仓库名称是不能为空" },
          { max: 20, message: "请输入20字以内的仓库名称" }
        ],
        siteTotal: [{ required: true, message: "库位数量是不能为空" }],
        area: [{ required: true, message: "省、市、县/区不能为空" }],
        fullAddress: [{ required: true, message: "详细地址是不能为空" }],
        contact: [{ required: true, message: "请输入联系人" }],
        contactNumber: [
          { required: true, message: "请输入联系方式" },
          { pattern: /^[0-9_\-、]+$/gi, message: "联系方式格式错误" }
        ]
      },
      editing: false
    };
  },

  methods: {
    async show(editing = false, data) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key];
      });
      const { provinceId, cityId, areaId } = data;
      this.form.area = [provinceId, cityId, areaId];
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
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
