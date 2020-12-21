<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + 'B类套餐配置'"
    :visible.sync="visible"
    :before-close="close"
    width="400px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="规则" prop="status">
        <el-select
          v-model="form.configIdList"
          placeholder="请选择规则"
          style="width:100%"
          filterable
          multiple
        >
          <el-option
            v-for="v in configList"
            :key="v.id"
            :label="`${v.type}[${v.configCode}]`"
            :value="v.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input
          v-model="form.desc"
          type="textarea"
          :rows="3"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import debounce from "@/utils/debounce";
import api from "@/api/sell-product";

export default {
  props: {
    configList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        id: null,
        name: null,
        configIdList: [],
        desc: null
      },
      rules: {
        name: [{ required: true, message: "请输入名称" }],
        configIdList: [{ required: true, message: "请选择规则" }],
        desc: [{ max: 300, message: "请输入300字以内的描述" }]
      },
      editing: false
    };
  },
  methods: {
    async show(editing = false, data = {}) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key];
      });
    },
    close() {
      this.visible = false;
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
    },
    submit: debounce(function() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          const { productCode } = this.$route.params;
          const { editing, form } = this;
          this.loading = true;
          await (editing ? api.putPlanB : api.addPlanB)({
            ...form,
            productCode
          });
          this.close();
          this.$message.closeAll();
          this.$message.success((editing ? "保存" : "添加") + "成功！");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }, 300)
  }
};
</script>
