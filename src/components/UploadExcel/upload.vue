<template>
  <el-upload
    :action="action"
    drag
    ref="upload"
    class="upload"
    accept=".xls,.xlsx,application/vnd.ms-excel,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    :auto-upload="autoUpload"
    :show-file-list="showFileList"
    :limit="limit"
    :file-list="fileList"
    :on-change="onChange"
    :on-remove="onRemove"
    :on-error="onError"
    :on-success="onSuccess"
    :on-progress="onProgress"
    :disabled="uploading"
  >
    <i class="el-icon-upload" />
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div slot="tip" class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
  </el-upload>
</template>
<script>
export default {
  props: {
    showFileList: {
      type: Boolean,
      default: true
    },
    autoUpload: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number
    },
    action: String
  },
  data() {
    return {
      fileList: [],
      uploading: false
    };
  },
  methods: {
    abort(file) {
      this.$refs.upload.abort(file);
    },
    clearFiles() {
      this.abort(this.fileList[0]);
      this.fileList = [];
      this.$refs.upload.clearFiles();
      this.uploading = false;
    },
    submit() {
      this.$refs.upload.submit();
    },
    onChange(file, fileList) {
      if (file) {
        this.fileList = [
          { ...file, status: file.status === "fail" ? "ready" : file.status }
        ];
      }
      this.$emit("change", file, fileList);
    },
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    onError(err, file, fileList) {
      this.uploading = false;
      this.$emit("finish", err, file, fileList);
      this.$emit("error", err, file, fileList);
      let message = "上传失败！";
      try {
        let resp = JSON.parse(err.message);
        message = resp.message;
      } finally {
        this.$message.closeAll();
        this.$message.error(message);
      }
    },
    onSuccess(res, file, fileList) {
      this.uploading = false;
      this.$emit("finish", res, file, fileList);
      this.$emit("success", res, file, fileList);
    },
    onProgress(event, file, fileList) {
      this.uploading = true;
      this.$emit("progress", event, file, fileList);
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
