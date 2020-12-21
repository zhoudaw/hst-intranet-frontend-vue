<template>
  <div>
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="包号" prop="baseCustomerId">
              <el-input v-model="form.packageNo" placeholder="请输入包号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="电商订单号" prop="firstOrderNo">
              <el-input
                v-model="form.firstOrderNo"
                placeholder="请输入电商订单号"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="快递单号" prop="expressNo">
              <el-input v-model="form.packageNo" placeholder="请输入快递单号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="运输方式" prop="transportMode">
              <el-select
                v-model="form.transportMode"
                placeholder="请选择运输方式"
                filterable
                style="width:100%"
              >
                <el-option
                  v-for="(v, i) in airData.tranMode || []"
                  :key="i"
                  :label="v"
                  :value="v"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="币制" prop="currencyCode">
              <el-select
                v-model="form.currencyCode"
                placeholder="请选择币制"
                filterable
                style="width:100%"
              >
                <el-option
                  v-for="v in airData.currency || []"
                  :key="v.id"
                  :label="v.name"
                  :value="v.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="长CM" prop="boxLength">
              <el-input-number
                v-model="form.boxLength"
                controls-position="right"
                placeholder="请输入长CM"
                style="width:100%"
                :min="0"
                :precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="宽CM" prop="boxWidth">
              <el-input-number
                v-model="form.boxWidth"
                controls-position="right"
                placeholder="请输入宽CM"
                style="width:100%"
                :min="0"
                :precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="高CM" prop="boxHeight">
              <el-input-number
                v-model="form.boxHeight"
                controls-position="right"
                placeholder="请输入高CM"
                style="width:100%"
                :min="0"
                :precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="目的国(地区)" prop="destinationState">
              <el-select
                v-model="form.destinationState"
                placeholder="请选择目的国(地区)"
                filterable
                style="width:100%"
              >
                <el-option
                  v-for="v in airData.state || []"
                  :key="v.id"
                  :label="v.name"
                  :value="v.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="运抵国(地区)" prop="arriveState">
              <el-select
                v-model="form.arriveState"
                placeholder="请选择运抵国(地区)"
                filterable
                style="width:100%"
              >
                <el-option
                  v-for="v in airData.state || []"
                  :key="v.id"
                  :label="v.name"
                  :value="v.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-table
          :data="baseOrderBox.baseOrderGoodsList || []"
          style="width: 100%"
          class="mt1"
          max-height="600"
          ref="table"
        >
          <el-table-column
            prop="hsName"
            label="商品/物品名称"
            min-width="150"
          />
          <el-table-column
            prop="englishGoodsName"
            label="英文名称"
            min-width="150"
          />
          <el-table-column prop="hsCode" label="商品编码" width="120" />
          <el-table-column
            prop="declarationUnit"
            label="申报计量单位"
            width="100"
          />
          <el-table-column
            prop="specifications"
            label="商品规格/型号"
            min-width="150"
          />
          <el-table-column prop="declarationQty" label="数量" min-width="100" />
          <el-table-column prop="singleWeight" label="毛重KG" min-width="100" />
          <el-table-column prop="price" label="单价" min-width="100" />
          <el-table-column prop="totalPrice" label="总价" min-width="100" />
        </el-table>
        <div class="btn-center mt3">
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button size="small" type="primary" @click="submit">
            确 定
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import RouteLeave from "../mixin/RouteLeave";
import { express as api } from "@/api/order";
import { mapGetters } from "vuex";
export default {
  name: "OrderExpressForm",
  mixins: [RouteLeave],
  data() {
    return {
      loading: false,
      form: {
        packageNo: null,
        firstOrderNo: null,
        expressNo: null,
        transportMode: null,
        currencyCode: null,
        // 长CM
        boxLength: null,
        // 宽CM
        boxWidth: null,
        // 高CM
        boxHeight: null,
        destinationState: null,
        arriveState: null,
        boxId: null
      },
      baseOrderBox: {},
      rules: {
        expressNo: [{ required: true, message: "请输入快递单号" }],
        transportMode: [{ required: true, message: "请输入运输方式" }],
        currencyCode: [{ required: true, message: "请输入币制" }]
      }
    };
  },
  computed: {
    ...mapGetters("expressOrder", ["airData"])
  },
  mounted() {
    const { name } = this.$route;
    let editing = name === "OrderExpressUpdate";
    editing && this.getDetail();
    this.$store.dispatch("expressOrder/getAirData");
  },
  methods: {
    async getDetail() {
      try {
        this.loading = true;
        const { id } = this.$route.params;
        const { data } = await api.detail(id);
        const detail = (data || {}).baseOrder || {};
        const baseOrderBoxList = detail.baseOrderBoxList || [];
        const baseOrderBox = baseOrderBoxList[0] || {};
        let whiteList = ["boxLength", "boxWidth", "boxHeight"];
        Object.keys(this.form).forEach(k => {
          if (whiteList.includes(k)) return;
          this.form[k] = detail[k];
        });
        this.baseOrderBox = baseOrderBox;
        this.form.boxId = baseOrderBox.id || null;
        this.form.boxLength = baseOrderBox.boxLength || null;
        this.form.boxWidth = baseOrderBox.boxWidth || null;
        this.form.boxHeight = baseOrderBox.boxHeight || null;
      } finally {
        this.loading = false;
      }
    },
    async cancel() {
      this.$refs.form.resetFields();
      let confirm = await this.routeLeaveConfirm();
      if (!confirm) return;
      this.allowLeave = true;
      this.$router.go(-1);
    },
    async submit() {
      try {
        this.loading = true;
        const { name, params } = this.$route;
        let editing = name === "OrderExpressUpdate";
        const form = { ...this.form, baseOrderId: params.id };
        delete form.baseOrderBoxList;
        await (editing ? api.update : api.create)(form);
        this.allowLeave = true;
        this.$message.closeAll();
        this.$message.success((editing ? "更新" : "添加") + "成功！");
        this.$router.go(-1);
      } finally {
        this.loading = false;
      }
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
