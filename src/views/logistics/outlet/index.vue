<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.content"
        style="width:180px"
        placeholder="网点名"
      />
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      max-height="600"
      v-loading="loading"
      ref="table"
    >
      <el-table-column prop="outletName" label="网点名" min-width="120" />
      <el-table-column prop="address" label="网点地址" min-width="200" />
      <el-table-column prop="contact" label="联系人" min-width="120" />
      <el-table-column prop="phone" label="联系方式" min-width="120" />
      <el-table-column prop="contactNumber" label="网点电话" min-width="120" />
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
import api from "@/api/outlet";
import debounce from "@/utils/debounce";
export default {
  name: "LogisticsOutlet",
  data() {
    return {
      query: {
        content: null,
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
        const { id } = this.$route.params;
        let query = { parentId: id * 1, ...this.query };
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
