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
    >
      <el-table-column prop="name" label="商品" min-width="150" />
      <el-table-column prop="code" label="商品编码" min-width="150" />
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
import { productCode as api } from "@/api/info-maintain";
import debounce from "@/utils/debounce";
import FormDialog from "./components/FormDialog";

export default {
  name: "InfoMaintainProductCode",
  components: {
    FormDialog
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
    async onRemove({ id }) {
      let confirm = await this.$confirm(
        "商品编码将不可恢复，您是否删除？",
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
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.table-expand {
  font-size: 0;

  .el-form-item {
    margin-bottom: 4px;
    &__label,
    &__content {
      line-height: normal;
    }
    &__label {
      color: #99a9bf;
      font-weight: normal;
    }
    &__content {
      word-break: break-all;
    }
  }
}
</style>
