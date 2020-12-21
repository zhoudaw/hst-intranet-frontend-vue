<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '角色'"
    :visible.sync="visible"
    :before-close="close"
    width="700px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model.trim="form.name" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="角色描述" prop="desc">
            <el-input v-model="form.desc" placeholder="请输入角色描述" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色权限" prop="permissionIdList">
            <el-tree
              :key="visible"
              class="permission-tree"
              :data="permissionTreeList"
              show-checkbox
              node-key="newId"
              ref="tree"
              highlight-current
              accordion
              @check-change="treeCheckChange"
              :props="defaultProps"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import api from "@/api/role";
import debounce from "@/utils/debounce";
export default {
  data() {
    let validatorName = (rule, value, callback) => {
      if (!value) return callback("请输入角色名称");
      if (value.length > 8) return callback("请输入8字以内的角色名称");
      this.checkName({ checkName: value, id: this.form.id }, callback);
    };

    return {
      visible: false,
      form: {
        id: null,
        name: null,
        desc: null,
        permissionIdList: [],
        navIdList: [],
        authIdList: []
      },
      detail: {},
      rules: {
        name: [{ required: true, validator: validatorName }],
        desc: [{ max: 30, message: "请输入30字以内的描述" }],
        permissionIdList: [{ required: true, message: "请选择权限" }]
      },
      editing: false,
      defaultProps: {
        children: "childList",
        label: "name"
      }
    };
  },
  computed: {
    ...mapGetters("role", ["permissionTreeList"])
  },
  methods: {
    async show(editing = false, role) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      const { data } = await api.detail(role.id);
      const detail = data || {};
      this.detail = detail;
      Object.keys(this.form).forEach(key => {
        this.form[key] = detail[key];
      });
      this.$nextTick(() => {
        let permissionList = data.permissionViewList
          .filter(v => v.parentId !== 0 && !v.flag)
          .map(v => {
            return "auth" + v.id;
          });
        this.$refs.tree.setCheckedKeys(permissionList);
      });
    },
    close() {
      this.visible = false;
      this.detail = {};
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
    },
    checkName: debounce(async function(query = {}, callback) {
      try {
        const { data } = await api.checkName(query);
        if (!data.response) {
          return callback("系统中存在重复信息");
        }
        callback();
      } catch (e) {
        return callback(e.message || "系统异常");
      }
    }, 300),
    treeCheckChange() {
      let trees = this.$refs.tree.getCheckedNodes();
      let keys = this.$refs.tree.getCheckedKeys();
      let authIdList = [];
      let navIdList = [];
      trees.forEach(v => {
        if (v.type === "nav") {
          navIdList.push(v.id, v.parentId);
        } else {
          navIdList.push(v.parentId);
          authIdList.push(v.id);
        }
      });
      let navId = this.getNavId(navIdList);
      this.form.navIdList = [...new Set(navId)];
      // this.form.navIdList = [...new Set(navIdList)]
      this.form.authIdList = [...new Set(authIdList)];
      this.form.permissionIdList = keys;
    },
    getNavId(list = []) {
      const idList = [];
      this.permissionTreeList.forEach(tree => {
        if (tree.childList) {
          tree.childList.forEach(item => {
            if (list.indexOf(item.id) > -1 && item.type === "nav") {
              idList.push(item.parentId);
            }
          });
        }
      });
      return [...list, ...idList];
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          const { editing, form } = this;
          this.loading = true;
          await (editing ? api.update : api.create)(form);
          this.close();
          this.$message.closeAll();
          this.$message.success((editing ? "保存" : "添加") + "成功！");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.permission-tree {
  width: 100%;
  height: 300px;
  overflow-y: auto;
  border-radius: 4px;
  border: 1px solid #e9edf2;
}
</style>
