<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.content"
        style="width:220px"
        placeholder="公司名、联系人、手机号"
      />
      &#x3000;
      <el-button type="primary" icon="el-icon-plus" @click="skipForm()">
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
      <el-table-column prop="companyName" label="公司名" min-width="120" />
      <el-table-column prop="contact" label="联系人" min-width="120" />
      <el-table-column prop="phone" label="手机号" min-width="120" />
      <el-table-column prop="childOutetNum" label="网点数" min-width="120" />
      <el-table-column prop="address" label="地址" min-width="250" />
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
              @click="skipForm(true, row)"
            />
          </el-tooltip>
          &nbsp;
          <el-tooltip content="网点管理" placement="top">
            <router-link :to="'/logistics/outlet/' + row.id">
              <el-button type="text" icon="el-icon-arrow-right" />
            </router-link>
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
</template>

<script>
import api from "@/api/logistics";
import debounce from "@/utils/debounce";
export default {
  name: "Logistics",
  data() {
    return {
      query: {
        content: null,
        pageIndex: 1,
        pageSize: 30
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
    skipForm(editing = false, row = {}) {
      this.$router.push({
        name: `Logistics${editing ? "Update" : "Create"}`,
        params: {
          id: row.id
        }
      });
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

<style lang="scss" scoped></style>
