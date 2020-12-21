<template>
  <el-card>
    <div slot="header">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.alikeName"
        style="width:200px"
        placeholder="搜索"
      />
      &#x3000;
      <el-button type="primary" icon="el-icon-plus" @click="openDialog()">
        新增
      </el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      max-height="600"
      v-loading="loading"
      ref="table"
      @cell-click="onCellClick"
    >
      <el-table-column prop="name" label="客户名称" min-width="150" />
      <el-table-column prop="customerService" label="客服" min-width="150" />
      <el-table-column
        prop="declareUserList"
        label="申报人及其身份证"
        min-width="200"
      >
        <template slot-scope="{ row }">
          <div v-for="(v, i) in row.declareUserList || []" :key="i">
            <el-tag>{{ v.name }}-{{ v.idNum }} </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="操作"
        width="100"
        fixed="right"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tooltip content="编辑" placement="top">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="openDialog(true, row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="onRemove(row)"
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
    <form-dialog ref="dialog" @refresh="refresh" />
    <declare-user-dialog ref="declareDialog" @refresh="refresh" />
  </el-card>
</template>

<script>
import { customer as api } from "@/api/info-maintain";
import debounce from "@/utils/debounce";
import FormDialog from "./components/FormDialog";
import DeclareUserDialog from "./components/DeclareUserDialog";
export default {
  name: "InfoMaintainCustomer",
  components: {
    FormDialog,
    DeclareUserDialog
  },
  data() {
    return {
      query: {
        alikeName: null,
        pageIndex: 1,
        pageSize: 30,
        status: null
      },
      list: [],
      count: 0,
      loading: false
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
      this.query = {
        alikeName: null,
        pageIndex: 1,
        pageSize: 30,
        status: null
      };
      await this.getList();
    },
    openDialog(editing = false, data) {
      this.$refs.dialog.show(editing, data);
    },
    async onRemove({ id }) {
      let confirm = await this.$confirm(
        "客户名称将不可恢复，您是否删除？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {});
      if (!confirm) return;
      await api.remove(id);
      this.$message.closeAll();
      this.$message.success("删除成功!");
      this.getList();
    },
    onCellClick(row, column) {
      if (column.property === "declareUserList") {
        this.$refs.declareDialog.show(row);
      }
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
    }, 300)
  }
};
</script>
