<template>
  <div>
    <el-card class="mb1">
      <div class="clearfix">
        <el-input
          prefix-icon="el-icon-search"
          clearable
          v-model.trim="query.alikeName"
          style="width:250px"
          placeholder="搜索"
        />

        <el-button
          type="primary"
          :icon="'el-icon-arrow-' + (expandSearch ? 'up' : 'down')"
          class="float-right"
          @click="expandSearch = !expandSearch"
        >
          高级搜索
        </el-button>
      </div>
      <el-collapse-transition>
        <list-search-form
          v-show="expandSearch"
          @expand="expandSearch = !expandSearch"
          @submit="onForm"
          @reset="onForm"
          :loading="loading"
        />
      </el-collapse-transition>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <el-button-group>
          <el-button
            :disabled="loading || !selectionIdList.length"
            @click="onBatchRemove"
          >
            批量删除
          </el-button>
          <el-button @click="$router.push({ name: 'OrderStorageSelectMerge' })">
            并单
          </el-button>

          <el-button @click="showImport">导入订单</el-button>
          <el-button @click="showBatchUpdate">批量更新</el-button>
          <el-button
            :disabled="!selectionIdList.length"
            @click="onMoveBl(selectionIdList)"
          >
            批量移至提单
          </el-button>
          <el-button
            icon="el-icon-download"
            :disabled="!selectionIdList.length"
            @click="onExport()"
            :loading="downloading"
          >
            导出订单
          </el-button>
          <el-button
            icon="el-icon-download"
            @click="onExport('all')"
            :loading="downloading"
            :disabled="count === 0"
          >
            导出全部订单
          </el-button>
        </el-button-group>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="ml1 float-right"
          @click="$router.push({ name: 'OrderStorageCreate' })"
        >
          新增订单
        </el-button>
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
        <el-table-column label="创建日期" width="100">
          <template slot-scope="{ row }">
            {{ row.createTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="入库日期" width="100">
          <template slot-scope="{ row }">
            {{ row.putStorageDate | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="baseCustomerName"
          label="客户名称"
          min-width="150"
        />
        <el-table-column
          prop="realReceiver"
          label="真实收件人"
          min-width="120"
        />
        <el-table-column prop="declareUser" label="申报人" min-width="120" />
        <el-table-column
          prop="declareUserIdCard"
          label="申报人身份证"
          width="160"
        />
        <el-table-column label="申报人及其身份证列表" min-width="200">
          <template slot-scope="{ row }">
            <div v-for="(v, i) in parseDeclareUserList(row)" :key="i">
              <el-tag>{{ v.name }}-{{ v.idNum }} </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="innerGoods"
          label="商品/物品名称"
          min-width="150"
        />
        <el-table-column prop="goodsIdCode" label="唛头" min-width="150" />
        <el-table-column prop="totalBoxQty" label="总件数" min-width="100" />
        <el-table-column prop="totalWeight" label="总毛重" min-width="100" />
        <el-table-column prop="id" label="订单号" width="150" />
        <el-table-column
          prop="expressCompany"
          label="快递公司"
          min-width="150"
        />
        <el-table-column prop="expressNo" label="快递单号" width="150" />
        <el-table-column
          prop="totalWelogisticsNameight"
          label="物流公司"
          min-width="150"
        />
        <el-table-column prop="logisticsNo" label="物流单号" width="150" />
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
          width="190"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button size="mini" @click="onCopy(row)">复制</el-button>
            <el-button
              size="mini"
              v-if="row.status === 'CREATED'"
              @click="putInStorage(row)"
            >
              入库
            </el-button>
            <el-button
              size="mini"
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
                    name: 'OrderStorageDetail',
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
    <batch-update-form ref="batchUpdate" @refresh="refresh" />
    <move-bl-check-dialog ref="moveBlCheck" @refresh="onMoveBlCheck" />
    <move-bl-form ref="moveBl" @refresh="refresh" />
  </div>
</template>

<script>
import debounce from "@/utils/debounce";
import { storage as api } from "@/api/order";
import ListSearchForm from "./components/ListSearchForm";
import ImportExcelForm from "./components/ImportExcelForm";
import BatchUpdateForm from "./components/BatchUpdateForm";
import MoveBlCheckDialog from "./components/MoveBlCheckDialog";
import MoveBlForm from "./components/MoveBlForm";
import { storageStatus } from "@/constants/order";

export default {
  name: "OrderStorageList",
  components: {
    ListSearchForm,
    ImportExcelForm,
    BatchUpdateForm,
    MoveBlCheckDialog,
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
      statusList: storageStatus,
      query: {
        alikeName: null,
        pageIndex: 1,
        pageSize: 30,
        status: null,
        aCreateDate: null,
        aPutStorageDate: null,
        aBaseCustomerIdList: [],
        aRealReceiver: null,
        aDeclareUser: null,
        aDeclareUserIdCard: null,
        aGoodsName: null,
        aGoodsIdCode: null,
        aExpressCompany: null,
        aLogistics: null,
        aStatus: null,
        aDesc: null,
        aOrderId: null,
        aLogisticsNo: null,
        aExpressNo: null,
        aOrderIdList: [],
        aLogisticsNoList: [],
        aExpressNoList: []
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
    onForm(form) {
      this.query = {
        ...this.query,
        ...form,
        pageIndex: 1
      };
    },
    getStatusName({ status }) {
      const curr = storageStatus.find(v => v.value === status) || {};
      return curr.text || "未入库";
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
    parseDeclareUserList({ declareUserListJson }) {
      let list = [];
      try {
        list = JSON.parse(declareUserListJson);
      } catch (e) {
        list = [];
      }
      return list;
    },
    showImport() {
      this.$refs.import.show();
    },
    showBatchUpdate() {
      this.$refs.batchUpdate.show();
    },
    async onBatchRemove() {
      let confirm = await this.$confirm(
        "删除后订单将不可恢复，是否删除已选订单？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => false);
      if (!confirm) return;
      await api.batchRemove({ idList: this.selectionIdList });
      this.$message.closeAll();
      this.$message.success("删除成功!");
      this.getList();
    },
    async onExport(type) {
      let confirm = await this.$confirm("是否导出订单", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.downloading = true;
        this.$message.closeAll();
        this.$message.warning("正在导出中请稍等...");
        if (type === "all") {
          let query = { ...this.query };
          delete query.pageIndex;
          delete query.pageSize;
          await api.export(query);
        } else {
          await api.export({ idList: this.selectionIdList.join(",") });
        }
        this.$message.closeAll();
        this.$message.success("导出成功");
        // this.getList();
      } finally {
        this.downloading = false;
      }
    },
    async onCopy({ id }) {
      let confirm = await this.$confirm("是否确定复制？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        this.$message.closeAll();
        await api.copy(id);
        this.$message.success("复制成功");
        this.getList();
      } finally {
        this.loading = false;
      }
    },
    async putInStorage({ id }) {
      let confirm = await this.$confirm("您确定要入库吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        this.$message.closeAll();
        await api.putStorage({ idList: [id] });
        this.$message.success("入库成功");
        this.getList();
      } finally {
        this.loading = false;
      }
    },
    onMoveBl(idList = []) {
      this.$refs.moveBlCheck.show(idList);
    },
    onMoveBlCheck(idList) {
      this.$refs.moveBl.show(idList);
    }
  }
};
</script>

<style lang="scss" scoped></style>
