<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.alikeName"
        style="width:180px"
        placeholder="搜索"
      />
      <label class="ml1">
        <small>业务员: </small>
        <el-select
          v-model="query.salesman"
          placeholder="请选择业务员"
          style="width:150px"
          filterable
          clearable
        >
          <el-option
            v-for="(v, i) in salesmanList"
            :key="i"
            :label="v"
            :value="v"
          />
        </el-select>
      </label>
      <label class="ml1">
        <small>客服: </small>
        <el-select
          v-model="query.customerService"
          placeholder="请选择客服"
          style="width:150px"
          filterable
          clearable
        >
          <el-option
            v-for="(v, i) in customerServiceList"
            :key="i"
            :label="v"
            :value="v"
          />
        </el-select>
      </label>
      <el-button
        class="ml1"
        type="primary"
        icon="el-icon-plus"
        @click="showDialog()"
      >
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
      <el-table-column prop="customerCode" label="客户编号" min-width="120" />
      <el-table-column prop="nickname" label="客户名称" min-width="120" />
      <el-table-column prop="account" label="用户账号" min-width="110" />
      <el-table-column prop="phone" label="手机号" min-width="140" />
      <el-table-column prop="email" label="邮箱" min-width="140" />
      <el-table-column
        prop="type"
        label="客户类型"
        width="100"
        :filters="typeList"
        :filter-multiple="false"
        column-key="type"
      >
        <template slot-scope="{ row }">
          {{ row.type === 0 ? "个人" : "企业" }}
        </template>
      </el-table-column>
      <el-table-column prop="salesman" label="业务员" min-width="100" />
      <el-table-column prop="customerService" label="客服" min-width="100" />
      <el-table-column
        prop="settleAccountsModeName"
        label="结算模式"
        min-width="110"
      />
      <el-table-column
        prop="declareUserList"
        label="申报人及其身份证"
        min-width="200"
      >
        <template slot-scope="{ row }">
          <div v-for="(v, i) in row.declareUserList || []" :key="i">
            <el-tag>{{ v.name }}-{{ v.idNum }} </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="客户状态"
        width="100"
        fixed="right"
        align="center"
        :filters="statusList"
        :filter-multiple="false"
        column-key="status"
      >
        <template slot-scope="{ row }">
          {{ row.status === 0 ? "冻结" : "正常" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template slot-scope="{ row }">
          <el-button size="small" @click="changeStatus(row)">
            {{ row.status == 1 ? "冻结" : "激活" }}
          </el-button>
          <el-tooltip content="编辑" placement="top">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="showDialog(true, row)"
            />
          </el-tooltip>
          <el-tooltip content="价格配置" placement="top">
            <el-button
              type="text"
              icon="el-icon-setting"
              @click="
                $router.push({
                  name: 'CustomerSetting',
                  params: { id: row.id }
                })
              "
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
import api from "@/api/customer";
import debounce from "@/utils/debounce";
import { typeList, statusList } from "@/constants/customer";
import FormDialog from "./components/FormDialog";
import { mapGetters } from "vuex";
export default {
  name: "CustomerList",
  components: {
    FormDialog
  },
  data() {
    return {
      loading: false,
      query: {
        alikeName: null,
        pageIndex: 1,
        pageSize: 30,
        status: null,
        customerService: null,
        nickname: null,
        phone: null,
        salesman: null,
        type: null
      },
      list: [],
      count: 0,
      typeList,
      statusList
    };
  },
  computed: {
    ...mapGetters("customer", ["customerServiceList", "salesmanList"])
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
    this.$store.dispatch("customer/customerMngParam");
    this.getList();
  },
  methods: {
    async refresh() {
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
    onFilterChange({ type, status }) {
      type && (this.query.type = type.length ? type[0] : null);
      status && (this.query.status = status.length ? status[0] : null);
      this.query.pageIndex = 1;
    },
    async changeStatus({ id, status }) {
      let freeze = status === 0;
      let confirm = await this.$confirm(
        `您是否${freeze ? "激活" : "冻结"}该账户？？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {});
      if (!confirm) return;
      try {
        this.loading = true;
        this.$message.closeAll();
        await (freeze ? api.freeCustomer : api.disabledCustomer)(id);
        this.$message.success(`${freeze ? "激活" : "冻结"}成功`);
        this.getList();
      } finally {
        this.loading = false;
      }
    },
    showDialog(editing, row) {
      this.$refs.dialog.show(editing, row);
    }
  }
};
</script>

<style lang="scss" scoped></style>
