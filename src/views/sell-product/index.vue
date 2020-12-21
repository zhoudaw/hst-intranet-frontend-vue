<template>
  <el-card>
    <div slot="header">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.alikeName"
        style="width:180px"
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
      @filter-change="onFilterChange"
    >
      <el-table-column prop="status" label="生效状态" width="80">
        <template slot-scope="{ row }">
          {{ row.status === 0 ? "失效" : "生效" }}
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="产品代码" min-width="100" />
      <el-table-column prop="name" label="中文名称" min-width="100" />
      <el-table-column prop="englishName" label="英文名称" min-width="100" />
      <el-table-column prop="countryName" label="国家" min-width="180">
        <template slot-scope="{ row }">
          <span
            v-for="(v, i) in row.countryNameList || []"
            :key="i"
            class="mr1"
          >
            <el-tag>
              {{ v }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="备注" min-width="100" />
      <el-table-column
        prop="status"
        label="状态"
        width="60"
        fixed="right"
        :filters="statusList"
        :filter-multiple="false"
        column-key="status"
      >
        <template slot-scope="{ row }">
          {{ row.status === 1 ? "生效" : "失效" }}
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
          <el-tooltip content="价格配置" placement="top">
            <el-button
              type="text"
              icon="el-icon-setting"
              @click="
                $router.push({
                  name: 'SellProductSetting',
                  params: { productCode: row.productCode }
                })
              "
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
import api from "@/api/sell-product";
import debounce from "@/utils/debounce";
import { statusList } from "@/constants/sell-product";
import FormDialog from "./components/FormDialog";
export default {
  name: "SellProductList",
  components: {
    FormDialog
  },
  data() {
    return {
      loading: false,
      query: {
        alikeName: null,
        pageIndex: 1,
        pageSize: 50,
        status: null
      },
      list: [],
      count: 0,
      statusList
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
      this.$refs.table.clearFilter();
      this.query.pageIndex = 1;
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
    onFilterChange({ status }) {
      status && (this.query.status = status.length ? status[0] : null);
      this.query.pageIndex = 1;
    },
    openDialog(editing = false, data) {
      this.$refs.dialog.show(editing, data);
    },
    async onRemove({ id }) {
      let confirm = await this.$confirm("确定删除该销售产品？", "提示", {
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
