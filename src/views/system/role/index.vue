<template>
  <el-card :body-style="{ padding: 0 }" v-loading="loading">
    <el-row slot="header">
      <el-col :xs="24" :sm="8" :md="6" class="left">
        <el-input
          prefix-icon="el-icon-search"
          clearable
          v-model.trim="alikeName"
          @input="getList"
          placeholder="角色名称"
        />
      </el-col>
      <el-col :xs="24" :sm="16" :md="18" class="right">
        <div class="role-info">
          <div>角色信息 · {{ current.name }}</div>
          <div
            v-if="current.desc"
            style="font-size:12px;color:#8492a6;padding-top:4px;"
          >
            {{ current.desc }}
          </div>
        </div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="openDialog(false)"
        >
          新增
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="8" :md="6" class="left">
        <div class="role-total">所有角色 {{ count }}</div>
        <ul class="role-list">
          <li
            v-for="v in list"
            :key="v.id"
            class="clearfix"
            :class="{ active: current.id == v.id }"
            @click="onSelect(v)"
          >
            <div class="title">
              {{ v.name }}
            </div>
            <span>
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click.stop="openDialog(true, v)"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click.stop="onRemove(v)"
                />
              </el-tooltip>
            </span>
          </li>
        </ul>
      </el-col>
      <el-col :xs="24" :sm="16" :md="18" class="right">
        <keep-alive>
          <el-row :gutter="10" :key="current.id">
            <template v-for="v in rolePermissionTree">
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                v-if="v.show"
                :key="v.id"
              >
                <role-tree :node="v" />
              </el-col>
            </template>
          </el-row>
        </keep-alive>
      </el-col>
    </el-row>
    <form-dialog ref="dialog" @refresh="refresh" />
  </el-card>
</template>

<script>
import api from "@/api/role";
import { mapGetters } from "vuex";
import debounce from "@/utils/debounce";
import RoleTree from "./components/RoleTree";
import FormDialog from "./components/FormDialog";

export default {
  name: "SystemRole",
  components: {
    RoleTree,
    FormDialog
  },
  data() {
    return {
      loading: false,
      alikeName: null,
      list: [],
      count: 0,
      current: {},
      detail: {},
      rolePermissionTree: []
    };
  },
  computed: {
    ...mapGetters("role", ["permissionTreeList"])
  },
  mounted() {
    this.$store.dispatch("role/permissionTreeList");
    this.getList();
  },
  methods: {
    async getPermissionTreeList() {
      await this.$store.dispatch("role/permissionTreeList");
      this.rolePermissionTree = this.generateTree();
    },
    async refresh() {
      this.alikeName = null;
      await this.getList();
    },
    getList: debounce(async function() {
      try {
        this.loading = true;
        const { data } = await api.list({ name: this.alikeName });
        this.list = data.list || [];
        this.count = data.count || 0;
        this.current = {};
        this.count > 0 && this.onSelect(this.list[0]);
      } finally {
        this.loading = false;
      }
    }, 300),
    openDialog(editing = false, data) {
      this.$refs.dialog.show(editing, data);
    },
    async onSelect(role) {
      if (this.current.id === role.id) return;
      this.current = role;
      try {
        this.loading = true;
        const { data } = await api.detail(role.id);
        this.detail = data || {};
        this.rolePermissionTree = this.generateTree();
      } finally {
        this.loading = false;
      }
    },
    generateTree() {
      const { permissionViewList } = this.detail;
      const permissionTreeList = [...this.permissionTreeList];
      const filterTree = list => {
        list.forEach(v => {
          v.show = false;
          (permissionViewList || []).forEach(tree => {
            if (tree.id === v.id && tree.name === v.name) {
              v.show = true;
            }
          });
          if (v.childList) filterTree(v.childList);
        });
      };
      filterTree(permissionTreeList);
      return permissionTreeList;
    },
    async onRemove({ id, userCount, name }) {
      this.$message.closeAll();
      if (userCount > 0) {
        this.$message.warning(
          `该角色已经被分配给 ${userCount} 个用户,暂时无法删除!`
        );
        return;
      }
      let confirm = await this.$confirm(
        `确定删除 "${name}" ？删除后将不可恢复！`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {});
      if (!confirm) return;
      await api.remove(id);
      this.$message.success("删除成功!");
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.left,
.right {
  font-size: 14px;
  padding: 0 10px;
  box-shadow: 1px 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8, 1px 1px 0 0 #e8e8e8,
    1px 0 0 0 #e8e8e8 inset, 0 1px 0 0 #e8e8e8 inset;
}
/deep/ .el-card {
  &__header {
    padding: 0;
    border: none;
    .left,
    .right {
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  &__body {
    .left,
    .right {
      height: 650px;
      overflow-y: auto;
    }
    .left {
      padding: 0;
      display: flex;
      flex-direction: column;
    }
  }
}

.role {
  &-total {
    height: 30px;
    line-height: 30px;
    color: #8492a6;
    font-size: 12px;
    padding: 0 20px;
  }
  &-list {
    margin: 0;
    padding: 0;
    list-style: none;
    flex: 1;
    overflow-y: auto;
    li {
      padding: 0 20px;
      margin: 0;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      transition: all 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
      .title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 10px;
      }
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        height: 40px;
        border-left: 3px solid #1890ff;
        transform: scaleY(0);
        opacity: 0;
        transition: transform 0.25s cubic-bezier(0.215, 0.61, 0.355, 1),
          opacity 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
      }

      &.active {
        background-color: #e6f7ff;
        position: relative;
        color: #1890ff;

        &:before {
          transform: scaleY(1);
          opacity: 1;
        }
      }
    }
  }
  &-info {
    flex: 1;
  }
}
</style>
