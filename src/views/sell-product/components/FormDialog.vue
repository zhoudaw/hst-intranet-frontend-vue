<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '销售产品'"
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
          <el-form-item label="代码" prop="productCode">
            <el-input v-model="form.productCode" placeholder="请输入产品代码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择生效状态"
              style="width:100%"
              filterable
            >
              <el-option
                v-for="v in statusList"
                :key="v.value"
                :label="v.text"
                :value="v.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="中文名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入中文名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名称" prop="englishName">
            <el-input v-model="form.englishName" placeholder="请输入英文名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家" prop="countryCodeList">
            <el-select
              v-model="form.countryCodeList"
              placeholder="请选择国家"
              style="width:100%"
              filterable
              multiple
              @change="onCountryChange"
            >
              <el-option
                v-for="v in baseStateList"
                :key="v.code"
                :label="`${v.name}(${v.code})`"
                :value="v.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="desc">
            <el-input
              type="textarea"
              v-model="form.desc"
              placeholder="请输入备注"
              :rows="3"
              resize="none"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from "@/api/sell-product";
import { statusList } from "@/constants/sell-product";
import { mapGetters } from "vuex";
import debounce from "@/utils/debounce";

export default {
  data() {
    return {
      visible: false,
      statusList,

      form: {
        id: null,
        productCode: null,
        status: null,
        name: null,
        englishName: null,
        countryCodeList: [],
        countryNameList: [],
        desc: null
      },
      rules: {
        productCode: [
          { required: true, message: "请输入产品代码" },
          { pattern: /\w+$/, message: "产品代码错误" }
        ],
        status: [{ required: true, message: "请选择生效状态" }],
        name: [{ required: true, message: "请输入中文名称" }],
        englishName: [{ required: true, message: "请输入英文名称" }],
        countryCodeList: [{ required: true, message: "请选择生效状态" }],
        desc: [{ max: 300, message: "请输入300字以内的描述" }]
      },
      editing: false
    };
  },
  computed: {
    ...mapGetters("storageOrder", ["createData"]),
    baseStateList() {
      const { baseStateList } = this.createData || {};
      return baseStateList || [];
    }
  },
  mounted() {
    this.$store.dispatch("storageOrder/createData");
  },
  methods: {
    async show(editing = false, data = {}) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key];
      });
    },
    close() {
      this.visible = false;
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
    },
    submit: debounce(function() {
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
    }, 300),
    onCountryChange(vals) {
      this.form.countryNameList = this.baseStateList
        .filter(v => vals.includes(v.code))
        .map(v => `${v.name}(${v.code})`);
    }
  }
};
</script>
