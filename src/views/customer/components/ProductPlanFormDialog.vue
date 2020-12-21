<template>
  <el-dialog
    :title="editing ? '编辑' : '添加'"
    :visible.sync="visible"
    :before-close="close"
    width="400px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="客服" prop="productCode">
        <el-select
          v-model="form.productCode"
          placeholder="请选择产品"
          style="width:100%"
          filterable
          :disabled="editing"
          @change="productCodeChange"
        >
          <el-option
            v-for="v in sellProductAll"
            :key="v.id"
            :label="v.name"
            :value="v.productCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品类型" prop="productType">
        <el-select
          v-model="form.productType"
          placeholder="请选择产品类型"
          style="width:100%"
          filterable
          @change="productTypeChange"
        >
          <el-option
            v-for="v in productTypeList"
            :key="v.value"
            :label="v.text"
            :value="v.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品套餐" prop="planCode">
        <el-select
          v-model="form.planCode"
          placeholder="请选择产品套餐"
          style="width:100%"
          filterable
          :loading="planListLoading"
        >
          <el-option
            v-for="v in planList"
            :key="v.id"
            :label="v.name"
            :value="v.planCode"
          />
        </el-select>
      </el-form-item>
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
import { mapGetters } from "vuex";
import { productTypeList } from "@/constants/customer";
import sellProductApi from "@/api/sell-product";
import api from "@/api/customer";

export default {
  data() {
    return {
      productTypeList,
      visible: false,
      loading: false,
      editing: false,
      form: {
        productCode: null,
        productType: null,
        planCode: null,
        mappingId: null
      },
      rules: {
        productCode: [{ required: true, message: "请选择产品" }],
        productType: [{ required: true, message: "请选择产品类型" }],
        planCode: [{ required: true, message: "请选择产品套餐" }]
      },
      planListLoading: false,
      planBList: [],
      planCList: []
    };
  },
  computed: {
    ...mapGetters("sellProduct", { sellProductAll: "listAll" }),
    planList() {
      const { productType } = this.form;
      if (productType === "B") return this.planBList;
      if (productType === "C") return this.planCList;
      return [];
    }
  },
  mounted() {
    this.$store.dispatch("sellProduct/listAll");
  },
  methods: {
    async show(editing = false, data = {}) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      const {
        expressProductCode,
        expressProductType,
        expressProductPlanCode,
        id
      } = data;
      this.form = {
        productCode: expressProductCode,
        productType: expressProductType,
        planCode: expressProductPlanCode,
        mappingId: id
      };
      this.getPlanList(expressProductCode);
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
          const { id } = this.$route.params;

          this.loading = true;
          await (editing ? api.updateExpressProduct : api.addExpressProduct)({
            ...form,
            customerId: id * 1
          });
          this.close();
          this.$message.closeAll();
          this.$message.success((editing ? "保存" : "添加") + "成功！");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    },
    productCodeChange(v) {
      this.form.planCode = null;
      this.getPlanList(v);
    },
    productTypeChange() {
      this.form.planCode = null;
    },
    async getPlanList(productCode) {
      try {
        this.planListLoading = true;
        const [res1, res2] = await Promise.all([
          sellProductApi.planBList(productCode),
          sellProductApi.planListByProductCode(productCode)
        ]).then(r => r.map(v => (v.data || []).list || []));
        this.planBList = res1;
        this.planCList = res2;
      } finally {
        this.planListLoading = false;
      }
    }
  }
};
</script>
