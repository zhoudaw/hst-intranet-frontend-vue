<template>
  <el-card>
    <div class="clearfix" slot="header">
      <el-button class="float-right" size="small" @click="showDialog()">
        新 增
      </el-button>
    </div>
    <el-table
      :data="pagination(pageNo, pageSize, productMappingList)"
      style="width: 100%"
      max-height="600"
      v-loading="loading"
      ref="table"
    >
      <el-table-column prop="expressProductName" label="产品" min-width="100" />
      <el-table-column
        prop="expressProductPlanName"
        label="价格套餐"
        min-width="100"
      />
      <el-table-column label="操作" width="100" fixed="right" align="center">
        <template slot-scope="{ row }">
          <el-tooltip content="产品详情" placement="top">
            <el-button
              type="text"
              icon="el-icon-view"
              @click="
                $router.push({
                  name: 'SellProductSetting',
                  params: { productCode: row.expressProductCode }
                })
              "
            />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="showDialog(true, row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="text" icon="el-icon-delete" @click="remove(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <el-pagination
        layout="total,prev,pager,next,jumper"
        background
        :total="productMappingList.length"
        :page-size="pageSize"
        :current-page.sync="pageNo"
      />
    </div>
    <product-plan-form-dialog ref="dialog" @refresh="getDetail" />
  </el-card>
</template>
<script>
import RouteLeave from "@/mixin/RouteLeave";
import api from "@/api/customer";
import { pagination } from "@/utils";
import ProductPlanFormDialog from "./components/ProductPlanFormDialog";
export default {
  name: "CustomerSetting",
  mixins: [RouteLeave],
  components: {
    ProductPlanFormDialog
  },
  data() {
    return {
      loading: false,
      detail: {},
      pageNo: 1,
      pageSize: 10
    };
  },
  computed: {
    productMappingList() {
      const { productMappingList } = this.detail;
      return productMappingList || [];
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    pagination,
    showDialog(editing, row) {
      this.$refs.dialog.show(editing, row);
    },
    async getDetail() {
      try {
        this.loading = true;
        const { id } = this.$route.params;
        const { data } = await api.detail(id);
        this.detail = data || {};
      } finally {
        this.loading = false;
      }
    },
    async remove({ id }) {
      let confirm = await this.$confirm("您是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        await api.removeExpressProduct(id);
        this.$message.closeAll();
        this.$message.success("删除成功!");
        this.getDetail();
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
