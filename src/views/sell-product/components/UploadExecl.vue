<template>
  <el-upload
    ref="upload"
    :action="planImportConfig(planId)"
    style="display: inline-block;"
    accept=".xls,.xlsx"
    :show-file-list="false"
    :auto-upload="false"
    :on-change="uploadChange"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :disabled="uploading"
  >
    <el-button size="small" icon="el-icon-upload" :loading="uploading">
      导入
    </el-button>
  </el-upload>
</template>
<script>
import api from "@/api/sell-product";
export default {
  props: {
    planId: [Number, String]
  },
  data() {
    return {
      uploading: false
    };
  },
  methods: {
    planImportConfig: api.planImportConfig,
    uploadChange(file) {
      if (file.status === "ready") {
        this.$confirm("确认导入?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$refs.upload.submit();
            this.uploading = true;
          })
          .catch(() => {});
      }
    },
    uploadSuccess() {
      this.uploading = false;
      this.$message.success("导入成功！");
      this.$emit("success");
    },
    uploadError(err) {
      this.uploading = false;
      let message = "导入失败！";
      try {
        let resp = JSON.parse(err.message);
        message = resp.message;
      } finally {
        if (err.status === 401) {
          this.$router.replace({
            name: "Login",
            query: {
              redirect: this.$route.fullPath
            }
          });
        }
        this.$message.error(message);
      }
    }
  }
};
</script>
