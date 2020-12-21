<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-input
          prefix-icon="el-icon-search"
          clearable
          v-model.trim="query.alikeName"
          style="width:250px"
          placeholder="搜索"
          class="mr1"
        />
        <el-button-group>
          <el-button @click="showImport">导入快递订单</el-button>
          <el-button
            :disabled="loading || !selectionIdList.length"
            @click="onApprove(selectionIdList)"
          >
            批量审核
          </el-button>
          <el-button
            :disabled="loading || !selectionIdList.length"
            @click="putInStorage(selectionIdList)"
          >
            批量入库
          </el-button>
          <el-button
            :disabled="!selectionIdList.length"
            @click="onMoveBl(selectionIdList)"
          >
            批量移至提单
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
        <el-table-column prop="packageNo" label="包号" width="120" />
        <el-table-column
          prop="firstOrderNo"
          label="电商订单号"
          min-width="150"
        />
        <el-table-column prop="expressNo" label="快递单号" min-width="180" />
        <el-table-column prop="customerName" label="客户名称" min-width="150" />
        <el-table-column prop="customerCode" label="客户编号" min-width="120" />
        <el-table-column
          prop="innerGoods"
          label="商品/物品名称"
          min-width="150"
        />
        <el-table-column prop="totalWeight" label="毛重KG" min-width="100" />
        <el-table-column prop="totalBoxQty" label="件数" min-width="100" />
        <el-table-column prop="totalPrice" label="申报总价" width="150" />
        <el-table-column prop="currencyCode" label="币制" width="150" />
        <el-table-column
          prop="status"
          label="仓库状态"
          width="100"
          fixed="right"
          align="center"
          :filters="statusList"
          :filter-multiple="false"
          column-key="status"
        >
          <template slot-scope="{ row }">
            {{ getStatusName(row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="操作"
          width="130"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              size="small"
              v-if="row.status === 'CHECKED'"
              @click="putInStorage([row.id])"
            >
              入库
            </el-button>
            <el-button
              size="small"
              v-if="row.allowMoveToBillsOfLading"
              @click="onMoveBl([row.id])"
            >
              移至提单
            </el-button>
            <el-tooltip content="详情" placement="top">
              <el-button
                type="text"
                icon="el-icon-view"
                @click="
                  $router.push({
                    name: 'OrderExpressDetail',
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
    <import-excel-form ref="import" @refresh="refresh" />
    <move-bl-form ref="moveBl" @refresh="refresh" />
  </div>
</template>

<script>
import debounce from "@/utils/debounce";
import { express as api } from "@/api/order";
import ImportExcelForm from "./components/ImportExcelForm";
import MoveBlForm from "./components/MoveBlForm";
import { expressStatus } from "@/constants/order";

export default {
  name: "OrderExpressList",
  components: {
    ImportExcelForm,
    MoveBlForm
  },
  provide() {
    return {
      pQuery: this.query
    };
  },
  data() {
    return {
      expandSearch: false,
      statusList: expressStatus,
      query: {
        alikeName: null,
        pageIndex: 1,
        pageSize: 30,
        status: null
      },
      list: [],
      count: 0,
      loading: false,
      downloading: false,
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
      this.$refs.table.clearSelection();
      this.$refs.table.clearFilter();
      this.query = this.$resetFields(this.query, ["pageSize"]);
      this.query.pageIndex = 1;
      await this.getList();
    },
    getStatusName({ status }) {
      const curr = expressStatus.find(v => v.value === status) || {};
      return curr.text || "未审核";
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
    onFilterChange({ status }) {
      status && (this.query.status = status.length ? status[0] : null);
      this.query.pageIndex = 1;
    },
    onSelectionChange(rows) {
      this.selectionIdList = rows.map(v => v.id);
    },
    showImport() {
      this.$refs.import.show();
    },
    async onApprove(idList = []) {
      let confirm = await this.$confirm("您确定要审核通过吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        this.$message.closeAll();
        await api.airCheck({ idList });
        this.$message.success("审核成功");
        this.getList();
      } finally {
        this.loading = false;
      }
    },
    async putInStorage(idList = []) {
      let confirm = await this.$confirm("您确定要入库吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        this.$message.closeAll();
        await api.putStorage({ idList });
        this.$message.success("入库成功");
        this.getList();
      } finally {
        this.loading = false;
      }
    },
    onMoveBl(idList = []) {
      this.$refs.moveBl.show(idList);
    }
  }
};
</script>
