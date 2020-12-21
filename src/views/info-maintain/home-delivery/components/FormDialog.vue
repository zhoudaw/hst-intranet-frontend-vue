<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '宅配商'"
    :visible.sync="visible"
    :before-close="close"
    width="400px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="宅配商" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入宅配商" />
      </el-form-item>
      <el-form-item label="宅配商记号" prop="desc">
        <el-input v-model.trim="form.desc" placeholder="请输入宅配商记号" />
      </el-form-item>
      <el-form-item label="宅配商记号" prop="desc">
        <single-upload :key="visible" @success="onUploadSuccess" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { homeDelivery as api } from "@/api/info-maintain";
import SingleUpload from "@/components/SingleUpload";
export default {
  components: {
    SingleUpload
  },
  data() {
    return {
      visible: false,
      form: {
        id: null,
        name: null,
        desc: null,
        headImg: "",
        headImgUrl: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入宅配商" },
          { max: 50, message: "请输入50字以内的宅配商" }
        ],
        desc: [
          { required: true, message: "请输入宅配商记号" },
          { max: 100, message: "请输入100字以内的宅配商记号" }
        ],
        headImg: [{ required: true, message: "请上传宅配商Logo" }]
      },
      editing: false
    };
  },
  methods: {
    async show(editing = false, data) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key];
      });
    },
    close() {
      this.visible = false;
      this.detail = {};
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
    },
    onUploadSuccess(file) {
      this.form.headImg = file.name;
      this.$refs.form.validateField("headImg");
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
