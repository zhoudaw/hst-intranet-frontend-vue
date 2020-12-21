<template>
  <el-card>
    <div slot="header">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.name"
        style="width:180px"
        placeholder="仓库名称"
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
    >
      <el-table-column prop="name" label="仓库名称" min-width="120" />
      <el-table-column prop="address" label="仓库地址" min-width="200" />
      <el-table-column prop="siteTotal" label="仓库位数" min-width="100" />
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
  </el-card>
</template>

<script>
import FormDialog from "./components/FormDialog";
import api from "@/api/warehouse";
import debounce from "@/utils/debounce";
export default {
  name: "Warehouse",
  components: {
    FormDialog
  },
  data() {
    return {
      query: {
        name: null,
        pageIndex: 1,
        pageSize: 30,
        status: null
      },
      list: [],
      count: 0,
      loading: false
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async refresh() {
      this.query = {
        name: null,
        pageIndex: 1,
        pageSize: 30,
        status: null
      };
      this.$refs.table.clearFilter();
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
    openDialog(editing = false, data) {
      this.$refs.dialog.show(editing, data);
    },
    async onRemove({ id }) {
      let confirm = await this.$confirm("确定删除该仓库？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      await api.remove(id);
      this.$message.closeAll();
      this.$message.success("删除成功!");
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
