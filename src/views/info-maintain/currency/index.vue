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
        prop="code"
        label="币制"
        min-width="150"
        sortable="custom"
      />
      <el-table-column prop="name" label="国家/地区" min-width="150" />
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
</template>

<script>
import { currency as api } from "@/api/info-maintain";
import debounce from "@/utils/debounce";
import { sortFormat } from "@/utils";
export default {
  name: "InfoMaintainCurrency",
  data() {
    return {
      query: {
        alikeName: null,
        codeSort: null,
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

<style lang="scss" scoped></style>
