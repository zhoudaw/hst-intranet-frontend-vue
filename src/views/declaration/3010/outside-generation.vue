<template>
  <div v-loading="loading">
    <el-card>
      <div slot="header">提单号: {{ billsOfLadingNo }}</div>
      <el-form ref="form" :model="form" label-position="top">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="收发货人代码" prop="receiverSenderCode">
              <el-input
                v-model="form.receiverSenderCode"
                placeholder="请输入收发货人代码"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="收发货人" prop="baseSenderId">
              <el-select
                v-model="form.baseSenderId"
                placeholder="请选择收发货人"
                filterable
                style="width:100%"
              >
                <el-option
                  v-for="v in baseSendReceiveList"
                  :key="v.id"
                  :label="v.name"
                  :value="v.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="目的港" prop="destinationPort">
              <el-input
                v-model="form.destinationPort"
                placeholder="请输入目的港"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="进出口岸代码" prop="iePortCode">
              <el-input
                v-model="form.iePortCode"
                placeholder="请输入进出口岸代码"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="航名" prop="flight">
              <el-input v-model="form.flight" placeholder="请输入航名" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="航次" prop="voyage">
              <el-input v-model="form.voyage" placeholder="请输入航次" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="报关类型" prop="declarationUnitCategoryCode">
              <el-select
                v-model="form.declarationUnitCategoryCode"
                placeholder="请输入报关类型"
                filterable
                style="width:100%"
              >
                <el-option
                  v-for="v in baseDeclarationCategoryList"
                  :key="v.id"
                  :label="v.code"
                  :value="v.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="mt1">
      <el-table
        :data="pagination(pageNo, 10, wdList)"
        style="width: 100%"
        max-height="600"
        ref="table"
      >
        <el-table-column prop="sn" label="序号" fixed="left" min-width="60" />
        <el-table-column
          prop="partExpressNo"
          label="分运单号"
          min-width="120"
        />
        <el-table-column prop="deliveryNo" label="派送单号" min-width="120" />
        <el-table-column prop="sender" label="发件人" min-width="200" />
        <el-table-column prop="receiver" label="收件人姓名" min-width="120" />
        <el-table-column
          prop="receiverPhone"
          label="收件人电话"
          min-width="120"
        />
        <el-table-column
          prop="receiverFullAddress"
          label="收件地址"
          min-width="150"
        />
        <el-table-column prop="receiverCity" label="城市" min-width="100" />
        <el-table-column prop="hsCode" label="HS编码" min-width="100" />
        <el-table-column prop="hsName" label="物品名称" min-width="150" />
        <el-table-column prop="specifications" label="规格" min-width="150" />
        <el-table-column prop="declarationUnit" label="单位" min-width="100" />
        <el-table-column prop="grossWeight" label="重量" min-width="100" />
        <el-table-column prop="totalBoxQty" label="件数" min-width="100" />
        <el-table-column prop="declarationQty" label="数量" min-width="100" />
        <el-table-column prop="price" label="单价" min-width="100" />
        <el-table-column prop="totalPrice" label="价值(RMB)" min-width="100" />
        <el-table-column prop="netWeight" label="净重" min-width="100" />
        <el-table-column prop="kindOfPackage" label="包装" min-width="100" />
        <el-table-column prop="stateCode" label="国别/地" min-width="100" />
        <el-table-column
          prop="declarationCategory"
          label="报关类型"
          min-width="100"
        />
        <el-table-column
          prop="declareUserIdCard"
          label="收件人身份证"
          min-width="150"
        />
      </el-table>
      <div class="table-footer">
        <el-pagination
          layout="total,prev,pager,next,jumper"
          background
          :total="wdCount"
          :page-size="10"
          :current-page.sync="pageNo"
        />
      </div>
    </el-card>
    <el-card class="mt1">
      <div class="btn-center">
        <el-button size="small" @click="$router.go(-1)" :disabled="loading">
          取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="submit"
          :loading="loading"
        >
          保 存
        </el-button>
        <el-button
          size="small"
          type="primary"
          :disabled="loading"
          @click="waiDaiDownload"
        >
          下载模板
        </el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import RouteLeave from "@/mixin/RouteLeave";
import api from "@/api/declaration/3010";
import { mapGetters } from "vuex";
import { pagination } from "@/utils";

export default {
  name: "Declaration3010OutsideGeneration",
  mixins: [RouteLeave],
  data() {
    return {
      billsOfLadingNo: null,
      form: {
        id: null,
        receiverSenderCode: null,
        baseSenderId: null,
        destinationPort: null,
        iePortCode: null,
        flight: null,
        voyage: null,
        declarationUnitCategoryCode: null,
        declarationUnitCategory: null
      },
      loading: false,
      wdList: [],
      wdCount: 0,
      pageNo: 1
    };
  },
  computed: {
    ...mapGetters("storageOrder", ["createData"]),
    baseSendReceiveList() {
      const { baseSendReceiveList } = this.createData || {};
      return baseSendReceiveList || [];
    },
    baseDeclarationCategoryList() {
      const { baseDeclarationCategoryList } = this.createData || {};
      return baseDeclarationCategoryList || [];
    }
  },
  created() {
    const { billsOfLadingNo } = this.$route.query;
    this.billsOfLadingNo = billsOfLadingNo;
    this.$store.dispatch("storageOrder/createData");
    this.init();
  },
  methods: {
    pagination,
    waiDaiDownload() {
      const { id } = this.$route.params;
      window.open(api.waiDaiDownload(id));
    },
    async init() {
      this.loading = true;
      await Promise.all([this.getDetail(), this.getWaiDaiList()]).catch(() => {
        this.loading = false;
      });
      this.loading = false;
    },
    async getDetail() {
      const { id } = this.$route.params;
      const { data } = await api.detail(id);
      let detail = data || {};
      this.form = {
        id,
        receiverSenderCode: detail.receiverSenderCode || "3502168351",
        baseSenderId: detail.baseSenderId || 7,
        destinationPort: detail.destinationPort || "TPE",
        iePortCode: detail.iePortCode || "3713",
        flight: detail.flight || null,
        voyage: detail.voyage || null,
        declarationUnitCategoryCode: detail.declarationUnitCategoryCode || "C",
        declarationUnitCategory: detail.declarationUnitCategory || null
      };
    },
    async getWaiDaiList() {
      const { id } = this.$route.params;
      const { data } = await api.waiDaiList({ declaration3010Id: id });
      this.wdList = data.list || [];
      this.wdCount = data.count;
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;

          const form = { ...this.form };
          let declarationUnitCategory = this.baseDeclarationCategoryList.find(
            v => v.code === form.declarationUnitCategoryCode
          );
          form.declarationUnitCategory =
            (declarationUnitCategory || {}).name || null;
          console.log(form);
          await api.publicInfo(form);
          this.$message.closeAll();
          this.$message.success("保存详情成功");
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
