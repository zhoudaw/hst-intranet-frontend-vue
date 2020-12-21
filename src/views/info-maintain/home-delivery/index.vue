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
      @sort-change="onSortChange"
    >
      <el-table-column
        prop="name"
        label="类别"
        min-width="150"
        sortable="custom"
      />
      <el-table-column prop="desc" label="宅配商记号" min-width="150" />
      <el-table-column prop="desc" label="宅配商Logo" width="100">
        <template slot-scope="{ row }">
          <el-image
            style="width: 60px; height: 60px"
            :src="row.headImgUrl"
            fit="fill"
          />
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
  </el-card>
</template>

<script>
import { homeDelivery as api } from "@/api/info-maintain";
import debounce from "@/utils/debounce";
import { sortFormat } from "@/utils";
import FormDialog from "./components/FormDialog";
export default {
  name: "InfoMaintainHomeDelivery",
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
    async onRemove({ id }) {
      let confirm = await this.$confirm(
        "宅配商将不可恢复，您是否删除？",
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
    }, 300),
    onSortChange({ prop, order }) {
      this.query[prop + "Sort"] = sortFormat(order);
      // this.query.pageIndex = 1;
    }
  }
};
</script>
