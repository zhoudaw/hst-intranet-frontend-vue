<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.customerCode"
        style="width:180px"
        placeholder="客户编号"
      />
      <el-button-group class="ml1">
        <el-button @click="onApplied" :disabled="!selectionIdList.length">
          核 销
        </el-button>
        <el-button @click="onInvalid" :disabled="!selectionIdList.length">
          作废收款
        </el-button>
        <el-button @click="onExport" :disabled="!count">导 出</el-button>
      </el-button-group>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      max-height="600"
      v-loading="loading"
      ref="table"
      @filter-change="onFilterChange"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="55" fixed align="center" />
      <el-table-column prop="customerName" label="客户名称" min-width="120" />
      <el-table-column prop="customerCode" label="客户编号" min-width="120" />
      <el-table-column prop="billsOfLadingNo" label="提单号" min-width="150" />
      <el-table-column prop="salesman" label="业务员" min-width="100" />
      <el-table-column
        prop="productName"
        label="运输方式(产品)"
        min-width="120"
      />
      <el-table-column
        prop="settleAccountsMode"
        label="结算方式"
        min-width="100"
      >
        <template slot-scope="{ row }">
          {{ row.settleAccountsMode | filterText(settleAccountsModeList) }}
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="金额" min-width="100" />
      <el-table-column
        prop="verifiedAmount"
        label="已核销金额"
        min-width="100"
      />
      <el-table-column prop="id" label="收据号" min-width="150" />
      <el-table-column prop="payNo" label="支付流水号" min-width="150" />
      <el-table-column prop="payTime" label="收款日期" min-width="150" />
      <el-table-column prop="desc" label="备注" min-width="150" />
      <el-table-column
        prop="statusName"
        label="状态"
        min-width="80"
        fixed="right"
        :filters="statusList"
        :filter-multiple="false"
        column-key="status"
      />
      <el-table-column
        prop="type"
        label="操作"
        width="60"
        fixed="right"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tooltip content="详情" placement="top">
            <el-button
              type="text"
              icon="el-icon-view"
              @click="
                $router.push({
                  name: 'FinanceCollectionDetail',
                  params: { id: row.id }
                })
              "
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <el-pagination
        layout="sizes,total,prev,pager,next,jumper"
        background
        :total="count"
        :page-sizes="[10, 30, 100, 200]"
        :page-size.sync="query.pageSize"
        :current-page.sync="query.pageIndex"
      />
    </div>
  </el-card>
</template>

<script>
import api from "@/api/collection";
import debounce from "@/utils/debounce";
import { settleAccountsModeList } from "@/constants";
export default {
  name: "FinanceCollection",
  data() {
    return {
      settleAccountsModeList,
      loading: false,
      createDates: [],
      query: {
        alikeName: null,
        customerCode: null,
        pageIndex: 1,
        pageSize: 30,
        status: null,
        createDateFrom: null,
        createDateTo: null
      },
      list: [],
      count: 0,
      statusList: [
        { value: "created", text: "创建" },
        { value: "verified", text: "核销" },
        { value: "invalid", text: "作废" }
      ],
      selectionIdList: []
    };
  },
  watch: {
    query: {
      handler() {
        this.getList();
      },
      deep: true
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    async refresh() {
      this.query.pageIndex = 1;
      this.$refs.table.clearSelection();
      await this.getList();
    },
    getList: debounce(async function() {
      try {
        this.loading = true;
        let query = { ...this.query };
        query.pageIndex--;
        const { data } = await api.list(query);
        this.list = data.list;
        this.count = data.count;
      } finally {
        this.loading = false;
      }
    }, 300),
    onCreateDateChange(vals) {
      this.query.createDateFrom = vals ? vals[0] : null;
      this.query.createDateTo = vals ? vals[1] : null;
      this.query.pageIndex = 1;
    },
    onFilterChange({ status }) {
      status && (this.query.status = status.length ? status[0] : null);
      this.query.pageIndex = 1;
    },
    onSelectionChange(rows) {
      this.selectionIdList = rows.map(v => v.id);
    },
    async onApplied() {
      let confirm = await this.$confirm("您是否核销？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        await api.verify({ idList: this.selectionIdList });
        this.$message.closeAll();
        this.$message.success("核销成功");
        this.refresh();
      } finally {
        this.loading = false;
      }
    },
    async onInvalid() {
      let confirm = await this.$confirm("您是否作废收款？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        await api.invalid({ idList: this.selectionIdList });
        this.$message.closeAll();
        this.$message.success("作废收款成功");
        this.refresh();
      } finally {
        this.loading = false;
      }
    },
    async onExport() {
      let confirm = await this.$confirm("您是否导出？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        let query = {
          ...this.query,
          idList: this.selectionIdList.join(",")
        };
        delete query.pageIndex;
        delete query.pageSize;
        await api.export(query);
        this.$message.closeAll();
        this.$message.success("导出成功");
        this.refresh();
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
