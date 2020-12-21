<template>
  <div v-loading="loading">
    <h5 class="mb0">套餐配置</h5>
    <div class="mb1 clearfix">
      <el-button size="small" class="float-right" @click="showDialog()">
        新增
      </el-button>
    </div>
    <el-table :data="list" style="width: 100%" max-height="600">
      <el-table-column prop="name" label="名称" min-width="100" />
      <el-table-column label="规则" min-width="200">
        <template slot-scope="{ row }">
          <span v-for="(v, i) in row.configNameList || []" :key="i" class="mr1">
            <el-tag>
              {{ v }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="备注" min-width="100" />
      <el-table-column
        prop="type"
        label="操作"
        width="60"
        fixed="right"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tooltip content="编辑" placement="top">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="showDialog(true, row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <el-pagination
        layout="total,prev,pager,next,jumper"
        background
        :total="count"
        :page-size="10"
        :current-page.sync="page"
        @current-change="onPageChange"
      />
    </div>
    <plan-b-form-dialog
      ref="dialog"
      :config-list="configList"
      @refresh="refresh"
    />
  </div>
</template>
<script>
import debounce from "@/utils/debounce";
import api from "@/api/sell-product";
import PlanBFormDialog from "./PlanBFormDialog";
export default {
  components: { PlanBFormDialog },
  props: {
    configList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      count: 0,
      page: 1
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async refresh() {
      this.page = 1;
      await this.getList();
    },
    onPageChange() {
      this.getList();
    },
    getList: debounce(async function() {
      const { productCode } = this.$route.params;
      try {
        this.loading = true;
        const { data } = await api.planBList(productCode, {
          pageSize: 10,
          pageIndex: this.page - 1
        });
        this.list = data.list || [];
        this.count = data.count || 0;
      } finally {
        this.loading = false;
      }
    }, 300),
    showDialog(editing = false, row = {}) {
      this.$refs.dialog.show(editing, row);
    }
  }
};
</script>
