<template>
  <el-card>
    <el-form label-position="left">
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="客户名称:">
            {{ detail.customerName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="运输方式(产品):">
            {{ detail.productName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="开航日期:">
            {{ detail.createTime | formatDate }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="起运港:">
            {{ detail.productName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="船名航次:">
            {{ detail.voy || 0 }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="目的港:">
            {{ detail.productName || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="应收单号:">
            {{ detail.id || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="提单号:">
            {{ detail.billsOfLadingNo || "-" }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="总金额:">
            <statistic :value="detail.totalAmount" :precision="2" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider />
    <el-form
      ref="form"
      :model="editRow"
      :rules="rules"
      status-icon
      v-loading="loading"
    >
      <el-table
        :data="list"
        style="width: 100%"
        max-height="600"
        ref="table"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="baseOrderId" label="订单号" min-width="180" />
        <el-table-column prop="costName" label="费用名称" min-width="150" />
        <el-table-column prop="currency" label="币制" min-width="100" />
        <el-table-column prop="grossWeight" label="重量" min-width="100" />
        <el-table-column prop="totalAmount" label="金额" min-width="120">
          <template slot-scope="{ row }">
            <el-form-item v-if="isEditing(row)" prop="totalAmount">
              <el-input v-model="editRow.totalAmount" />
            </el-form-item>
            <span v-else>{{ row.totalAmount }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="type"
          label="操作"
          width="120"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <template v-if="!isEditing(row)">
              <el-button type="text" @click="onEdit(row)">
                修改金额
              </el-button>
            </template>
            <template v-else>
              <el-button type="text" @click="onSave">
                保 存
              </el-button>
              <el-button type="text" @click="onCancel">
                取 消
              </el-button>
            </template>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="table-footer">
        <el-pagination
          layout="sizes,total,prev,pager,next,jumper"
          background
          :total="count"
          :page-sizes="[10, 30, 100, 200]"
          :page-size.sync="pageSize"
          :current-page.sync="pageNo"
          @size-change="getBillsList"
          @current-change="getBillsList"
        />
      </div>
    </el-form>
  </el-card>
</template>
<script>
import RouteLeave from "@/mixin/RouteLeave";
import api from "@/api/customer-bill";
import Statistic from "@/components/Statistic/index";
import debounce from "@/utils/debounce";
import { money } from "@/utils/pattern";
export default {
  name: "FinanceCustomerBillDetail",
  mixins: [RouteLeave],
  components: {
    Statistic
  },
  data() {
    return {
      loading: false,
      detail: {},
      list: [],
      count: 0,
      pageNo: 1,
      pageSize: 30,
      editRow: {},
      rules: {
        totalAmount: [
          { required: true, message: "请输入金额" },
          { type: "number", pattern: money, message: "金额格式错误" }
        ]
      }
    };
  },
  created() {
    this.getDetail();
    this.getBillsList();
  },
  methods: {
    async getDetail() {
      const { id } = this.$route.params;
      const { data } = await api.detail(id);
      this.detail = data || {};
    },
    getBillsList: debounce(async function() {
      try {
        this.loading = true;

        const { id } = this.$route.params;
        let query = {
          pageSize: this.pageSize,
          pageIndex: this.pageNo - 1
        };
        const { data } = await api.orderBillsList(id, query);
        this.list = data.list;
        this.count = data.count;
      } finally {
        this.loading = false;
      }
    }, 300),
    tableRowClassName({ row }) {
      let isEditing = this.isEditing(row);
      if (isEditing) {
        return "editing-row";
      }
      return "";
    },
    isEditing({ id }) {
      return this.editRow.id === id;
    },
    onEdit(row) {
      this.editRow = {
        ...row,
        roleId: row.roleIds * 1
      };
    },
    onCancel() {
      this.editRow = {};
    },
    onSave() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const { baseOrderId, customerBillsId, totalAmount } = this.editRow;
        await api.orderBillsUpdateAmount({
          baseOrderId,
          customerBillsId,
          totalAmount
        });
        this.$message.closeAll();
        this.$message.success("保存成功！");
        this.onCancel();
        this.getDetail();
        this.getBillsList();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item {
  margin-bottom: 0;
}
/deep/.editing-row {
  .el-form-item {
    // margin-bottom: 0;
    &__error {
      position: relative;
    }
  }
}
</style>
