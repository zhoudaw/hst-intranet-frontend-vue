<template>
  <el-card>
    <div slot="header">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.alikeName"
        style="width:200px"
        placeholder="搜索：发件人、电话"
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
      @sort-change="onSortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-form label-width="120px" class="table-expand">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="英文发件人">
                  {{ row.englishName || "-" }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="英文发件人地址">
                  {{ row.englishFullAddress || "-" }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="英文发件人城市">
                  {{ row.englishCity || "-" }}
                </el-form-item>
              </el-col>
              <el-col :span="24" />
              <el-col :span="8">
                <el-form-item label="英文经停城市">
                  {{ row.englishStopCity || "-" }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="发件人"
        min-width="150"
        sortable="custom"
      />
      <el-table-column prop="state" label="发件人国别" min-width="120" />
      <el-table-column prop="city" label="发件人城市" min-width="120" />
      <el-table-column prop="fullAddress" label="发件人地址" min-width="250">
        <template slot-scope="{ row }">
          {{ row.province }}{{ row.city }}{{ row.area }}{{ row.fullAddress }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="发件人电话" min-width="150" />
      <el-table-column
        prop="type"
        label="操作"
        width="80"
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
import { sender as api } from "@/api/info-maintain";
import debounce from "@/utils/debounce";
import { sortFormat } from "@/utils";
import FormDialog from "./components/FormDialog";

export default {
  name: "InfoMaintainSender",
  components: {
    FormDialog
  },
  data() {
    return {
      query: {
        alikeName: null,
        nameSort: null,
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
        nameSort: null,
        pageIndex: 1,
        pageSize: 30,
        status: null
      };
      this.$refs.table.clearSort();
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
    onSortChange({ prop, order }) {
      this.query[prop + "Sort"] = sortFormat(order);
      // this.query.pageIndex = 1;
    },
    async onRemove({ id }) {
      let confirm = await this.$confirm(
        "发件人将不可恢复，您是否删除？",
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
