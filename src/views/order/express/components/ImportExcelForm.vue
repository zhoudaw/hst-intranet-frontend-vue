<template>
  <el-dialog
    title="导入订单"
    :visible.sync="visible"
    :before-close="close"
    width="450px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <upload-excel
      ref="upload"
      :action="importExcel"
      @progress="loading = true"
      @finish="loading = false"
      @success="onSuccess"
    >
      <template slot="tip">
        只能上传 Excel 文件
        <el-link
          :href="downloadExcel"
          :underline="false"
          type="primary"
          target="_blank"
          style="font-size: 12px; font-weight: normal;vertical-align: inherit;"
        >
          下载模板
        </el-link>
      </template>
    </upload-excel>
    <div slot="footer">
      <el-button @click="close" :disabled="loading">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import UploadExcel from "@/components/UploadExcel/upload";
import { express as api } from "@/api/order";

export default {
  components: {
    UploadExcel
  },
  data() {
    return {
      visible: false,
      importExcel: api.importExcel,
      downloadExcel: api.downloadExcel,
      loading: false
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      if (this.loading) {
        this.$message.closeAll();
        this.$message.warning("文件上传中...");
        return;
      }
      this.loading = false;
      this.visible = false;
      this.$refs.upload.clearFiles();
    },
    submit() {
      this.$refs.upload.submit();
    },
    onSuccess() {
      this.close();
      this.$message.closeAll();
      this.$message.success("导入成功");
      this.$emit("refresh");
    }
  }
};
</script>
<style lang="scss" scoped>
.upload {
  /deep/.el-upload {
    display: block;
    &-dragger {
      width: 100%;
    }
  }
}
</style>
