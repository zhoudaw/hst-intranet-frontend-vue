<template>
  <el-dialog
    title="添加人员"
    :visible.sync="visible"
    :before-close="close"
    width="350px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="姓名" prop="userName">
        <el-input v-model.trim="form.userName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select
          v-model="form.roleId"
          style="width:100%"
          placeholder="请选择角色"
        >
          <el-option
            v-for="v in roleListAll"
            :key="v.id"
            :label="v.name"
            :value="v.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { phone } from "@/utils/pattern";
import api from "@/api/user";
import debounce from "@/utils/debounce";
export default {
  data() {
    const validatorUserName = (rule, value, callback) => {
      if (!value) {
        return callback("请输入姓名");
      }
      this.userCheck("name", value, callback);
    };
    const validatorPhone = (rule, value, callback) => {
      if (!value) {
        return callback("请输入手机号");
      }
      if (!phone.test(value)) {
        return callback("手机号格式错误");
      }
      this.userCheck("phone", value, callback);
    };
    return {
      loading: false,
      visible: false,
      form: {
        userName: null,
        phone: null,
        roleId: null,
        superAdmin: false
      },
      rules: {
        userName: [{ required: true, validator: validatorUserName }],
        phone: [{ required: true, validator: validatorPhone }],
        roleId: [{ required: true, message: "请选择角色" }]
      }
    };
  },
  computed: {
    ...mapGetters("role", { roleListAll: "listAll" })
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.$refs.form.resetFields();
      this.form = this.$resetFields(this.form);
    },
    userCheck: debounce(async function(flag = "phone", value, callback) {
      try {
        const { data } = await api.check({ checkValue: value, flag });
        if (!data.response) {
          return callback("系统中存在重复信息");
        }
        callback();
      } catch (e) {
        return callback("系统异常");
      }
    }, 300),
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;
          await api.create(this.form);
          this.close();
          this.$message.closeAll();
          this.$message.success("添加成功！");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
