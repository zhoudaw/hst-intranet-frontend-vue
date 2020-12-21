<template>
  <el-card>
    <el-form label-position="left">
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="客户名称:">
            {{ detail.customerName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="运输方式(产品):">
            {{ detail.productName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="开航日期:">
            {{ detail.createTime | formatDate }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="起运港:">
            {{ detail.productName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="船名航次:">
            {{ detail.voy || 0 }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="目的港:">
            {{ detail.productName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="应收单号:">
            {{ detail.id || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="提单号:">
            {{ detail.billsOfLadingNo || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="总金额:">
            <statistic :value="detail.totalAmount" :precision="2" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider />
    <div v-loading="loading">
      <el-table :data="list" style="width: 100%" max-height="600" ref="table">
        <el-table-column prop="baseOrderId" label="订单号" min-width="180" />
        <el-table-column prop="costName" label="费用名称" min-width="150" />
        <el-table-column prop="currency" label="币制" min-width="100" />
        <el-table-column prop="grossWeight" label="重量" min-width="100" />
        <el-table-column prop="totalAmount" label="金额" min-width="120" />
      </el-table>
      <div class="table-footer">
        <el-pagination
          layout="sizes,total,prev,pager,next,jumper"
          background
          :total="count"
          :page-sizes="[10, 30, 100, 200]"
          :page-size.sync="pageSize"
          :current-page.sync="pageNo"
          @size-change="detailItemList"
          @current-change="detailItemList"
        />
      </div>
    </div>
  </el-card>
</template>
<script>
import RouteLeave from "@/mixin/RouteLeave";
import api from "@/api/collection";
import Statistic from "@/components/Statistic/index";
import debounce from "@/utils/debounce";
export default {
  name: "FinanceCollectionDetail",
  mixins: [RouteLeave],
  components: {
    Statistic
  },
  data() {
    return {
      loading: false,
      detail: {},
      list: [],
      count: 0,
      pageNo: 1,
      pageSize: 30
    };
  },
  created() {
    this.getDetail();
    this.detailItemList();
  },
  methods: {
    async getDetail() {
      const { id } = this.$route.params;
      const { data } = await api.detail(id);
      this.detail = data || {};
    },
    detailItemList: debounce(async function() {
      try {
        this.loading = true;

        const { id } = this.$route.params;
        let query = {
          pageSize: this.pageSize,
          pageIndex: this.pageNo - 1
        };
        const { data } = await api.detailItemList(id, query);
        this.list = data.list;
        this.count = data.count;
      } finally {
        this.loading = false;
      }
    }, 300)
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item {
  margin-bottom: 0;
}
</style>
