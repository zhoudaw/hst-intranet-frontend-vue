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
    <div class="grid-wrap" v-loading="loading">
      <empty v-if="count == 0" />
      <el-row v-else>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          v-for="v in list"
          class="col-grid"
          :key="v.id"
        >
          {{ v.name || "-" }}
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
  </el-card>
</template>
<script>
import { unit as api } from "@/api/info-maintain";
import debounce from "@/utils/debounce";
export default {
  name: "InfoMaintainUnit",
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
  padding: 14px 16px;
  border: 0;
  border-radius: 0;
}
</style>
