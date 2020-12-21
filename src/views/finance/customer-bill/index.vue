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
      <label class="ml1">
        <small>账单日期：</small>
        <el-date-picker
          v-model="createDates"
          type="daterange"
          style="width:250px"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="onCreateDateChange"
        />
      </label>
      <el-button-group class="ml1">
        <el-button @click="onExport" :disabled="!count">导出订单</el-button>
        <el-button @click="onApproval" :disabled="!selectionIdList.length">
          审 核
        </el-button>
        <el-button @click="onSendEmail" :disabled="!selectionIdList.length">
          发送邮件
        </el-button>
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
      <el-table-column prop="billsOfLadingNo" label="提单号" min-width="180" />
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
      <el-table-column prop="totalAmount" label="应收金额" min-width="100" />
      <el-table-column prop="createBy" label="创建人" min-width="100" />
      <el-table-column prop="createTime" label="创建时间" min-width="150" />
      <el-table-column prop="approvalUserName" label="审批人" min-width="100" />
      <el-table-column prop="approvalTime" label="审批时间" min-width="150" />
      <el-table-column prop="payTime" label="付款日期" min-width="150" />
      <el-table-column prop="payType" label="付款方式" min-width="100" />
      <el-table-column prop="payNo" label="支付流水号" min-width="150" />
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
        width="110"
        fixed="right"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button
            size="small"
            v-if="row.status === 'created'"
            @click="onInvalid(row)"
          >
            作废
          </el-button>
          <el-button
            size="small"
            v-if="row.status === 'pending'"
            @click="showPay(row)"
          >
            支付
          </el-button>
          <el-tooltip content="账单明细" placement="top">
            <el-button
              type="text"
              icon="el-icon-view"
              @click="
                $router.push({
                  name: 'FinanceCustomerBillDetail',
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
    <pay-dialog ref="pay" @refresh="refresh" />
  </el-card>
</template>

<script>
import api from "@/api/customer-bill";
import debounce from "@/utils/debounce";
import { settleAccountsModeList } from "@/constants";
import PayDialog from "./components/PayDialog";
export default {
  name: "FinanceCustomerBill",
  components: {
    PayDialog
  },
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
        { value: "created", text: "待审核" },
        { value: "pending", text: "已审核" },
        { value: "completed", text: "已发布" },
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
    },
    async onApproval() {
      let confirm = await this.$confirm("您是否审核通过？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        await api.approval({ idList: this.selectionIdList });
        this.$message.closeAll();
        this.$message.success("审核成功");
        this.refresh();
      } finally {
        this.loading = false;
      }
    },
    async onInvalid({ id }) {
      let confirm = await this.$confirm("您是否作废？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        await api.invalid(id);
        this.$message.closeAll();
        this.$message.success("作废成功");
        this.refresh();
      } finally {
        this.loading = false;
      }
    },
    async onSendEmail() {
      let confirm = await this.$confirm("您是否发送邮件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        this.$message.closeAll();
        this.$message.success("邮件发送成功");
        this.refresh();
      } finally {
        this.loading = false;
      }
    },
    showPay(row) {
      this.$refs.pay.show(row);
    }
  }
};
</script>

<style lang="scss" scoped></style>
