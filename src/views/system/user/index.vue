<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.content"
        style="width:180px"
        placeholder="姓名、手机号"
      />
      &#x3000;
      <el-button type="primary" icon="el-icon-plus" @click="openDialog">
        新增
      </el-button>
    </div>
    <el-form ref="form" :model="editRow" :rules="rules" status-icon>
      <el-table
        :data="list"
        style="width: 100%"
        max-height="600"
        v-loading="loading"
        ref="table"
        @filter-change="onFilterChange"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="userName" label="姓名" min-width="120">
          <template slot-scope="{ row }">
            <el-form-item v-if="isEditing(row)" prop="userName">
              <el-input v-model="editRow.userName" />
            </el-form-item>
            <span v-else>{{ row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="140">
          <template slot-scope="{ row }">
            <el-form-item v-if="isEditing(row)" prop="phone">
              <el-input v-model="editRow.phone" />
            </el-form-item>
            <span v-else>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色"
          min-width="110"
          :filters="roleListOptions"
          :filter-multiple="false"
          filter-placement="bottom"
          column-key="roleId"
        >
          <template slot-scope="{ row }">
            <el-form-item v-if="isEditing(row)" prop="roleId">
              <el-select v-model="editRow.roleId">
                <el-option
                  v-for="v in roleListOptions"
                  :key="v.value"
                  :label="v.text"
                  :value="v.value"
                />
              </el-select>
            </el-form-item>
            <span v-else>
              {{ row.superAdmin ? "超级管理员" : row.roleName || "-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="操作"
          width="150"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }" v-if="!row.superAdmin">
            <template v-if="!isEditing(row)">
              <el-button size="mini" @click="onFreezeOrActivate(row)">{{
                row.status == 1 ? "冻结" : "激活"
              }}</el-button>
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="onEdit(row)"
                />
              </el-tooltip>
            </template>
            <template v-else>
              <el-button size="mini" @click="onSave">
                保存
              </el-button>
              <el-button size="mini" @click="onCancel">
                取消
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
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
import api from "@/api/user";
import debounce from "@/utils/debounce";
import { mapGetters } from "vuex";
import FormDialog from "./components/FormDialog";
export default {
  name: "SystemUser",
  components: {
    FormDialog
  },
  data() {
    return {
      loading: false,
      query: {
        content: null,
        pageIndex: 1,
        pageSize: 30,
        status: null,
        roleId: null
      },
      list: [],
      count: 0,
      customerTypeList: [
        { text: "个人", value: 0 },
        { text: "企业", value: 1 }
      ],
      statusList: [
        { text: "正常", value: 1 },
        { text: "冻结", value: 0 }
      ],
      editRow: {},
      rules: {
        userName: [{ required: true, message: "请输入人员名称" }],
        phone: [{ required: true, message: "手机号码不能为空" }],
        roleId: [{ required: true, message: "请选择角色" }]
      }
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
  computed: {
    ...mapGetters("role", { roleListAll: "listAll" }),
    roleListOptions() {
      return this.roleListAll.map(v => ({ text: v.name, value: v.id }));
    }
  },
  mounted() {
    this.$store.dispatch("role/listAll");
    this.getList();
  },
  methods: {
    async refresh() {
      this.query = {
        content: null,
        pageIndex: 1,
        pageSize: 30,
        status: null,
        roleId: null
      };
      this.$refs.table.clearFilter();
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
    onFilterChange({ roleId }) {
      roleId && (this.query.roleId = roleId.length ? roleId[0] : null);
      this.query.pageIndex = 1;
    },
    tableRowClassName({ row }) {
      let isEditing = this.isEditing(row);
      if (isEditing) {
        return "editing-row";
      }
      return "";
    },
    openDialog() {
      this.$refs.dialog.show();
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
    onSave() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const { id, userName, phone, roleId, superAdmin } = this.editRow;
        await api.update({ id, userName, phone, roleId, superAdmin });
        this.$message.closeAll();
        this.$message.success("保存成功！");
        this.onCancel();
        this.getList();
      });
    },
    onCancel() {
      this.editRow = {};
    },
    async onFreezeOrActivate({ id, status }) {
      let statusText = status == 1 ? "冻结" : "激活";
      let confirm = await this.$confirm(`您是否${statusText}该账户？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      await api.freezeOrActivate({ id, status: status === 0 ? 1 : 0 });
      this.$message.closeAll();
      this.$message.success(statusText + "成功!");
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.editing-row {
  .el-form-item {
    margin-bottom: 0;
    &__error {
      position: relative;
    }
  }
}
</style>
