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
      <el-button type="primary" icon="el-icon-plus" @click="openDialog">
        新增
      </el-button>
    </div>
    <div class="grid-wrap" v-loading="loading">
      <empty v-if="count == 0" />
      <el-row :gutter="10" v-else>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          v-for="v in list"
          class="col-grid"
          :key="v.id"
        >
          <span>{{ v.name || "-" }}</span>
          <el-tooltip content="删除" placement="top">
            <el-button type="text" icon="el-icon-delete" @click="onRemove(v)" />
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
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
import { packingType as api } from "@/api/info-maintain";
import debounce from "@/utils/debounce";
import FormDialog from "./components/FormDialog";
export default {
  name: "InfoMaintainPackingType",
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
    openDialog() {
      this.$refs.dialog.show();
    },
    async onRemove({ id }) {
      let confirm = await this.$confirm(
        "包装种类将不可恢复，您是否删除？",
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
<style lang="scss" scoped>
.grid-wrap {
  padding: 10px;
  margin-bottom: 20px;
  max-height: 600px;
  overflow-y: auto;
}
.col-grid {
  box-shadow: 1px 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8, 1px 1px 0 0 #e8e8e8,
    1px 0 0 0 #e8e8e8 inset, 0 1px 0 0 #e8e8e8 inset;
  padding: 10px 16px;
  border: 0;
  border-radius: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
