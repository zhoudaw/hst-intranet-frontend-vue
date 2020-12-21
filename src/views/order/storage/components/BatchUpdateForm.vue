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
      :action="batchUpdate"
      @progress="loading = true"
      @finish="loading = false"
      @success="onSuccess"
    >
      <template slot="tip">
        只能上传 Excel 文件
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
import { storage as api } from "@/api/order";

export default {
  components: {
    UploadExcel
  },
  data() {
    return {
      visible: false,
      batchUpdate: api.batchUpdate,
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
        this.$message.error("文件上传中...");
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
      this.$message.success("批量更新成功");
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
