<template>
  <el-upload
    class="single-upload-wrap"
    v-loading="loading"
    action="https://jsonplaceholder.typicode.com/posts/"
    :disabled="disabled"
    :show-file-list="false"
    :on-progress="handleProgress"
    :on-error="handleError"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
  >
    <div class="upload-img-box">
      <img :src="currFile.url" v-if="currFile && !isPdf" />
      <i class="iconfont icon-pdf" v-else-if="currFile && isPdf" />
      <i class="el-icon-upload" v-else />
    </div>
    <div class="upload-desc-box">
      <div class="el-upload__text" v-if="!currFile">
        只能上传{{ fileTypeText }}文件，且不超过{{ size }}M
      </div>
      <div class="el-upload__text img-info" v-else>
        <span class="text-ellipsis">{{ currFile.name }}</span>
        <!-- <transition name="el-zoom-in-top" v-if="progress>0">
          <el-progress :percentage="progress" :stroke-width="2"></el-progress>
        </transition> -->
        <div class="opt-box">
          <el-button size="small" type="text">重新上传</el-button>
          <span>|</span>
          <el-button size="small" type="text" @click.stop="onPreview">
            查看大图
          </el-button>
          <slot name="opt"></slot>
        </div>
      </div>
    </div>
  </el-upload>
</template>
<script>
export default {
  name: "SingleUpload",
  props: {
    file: Object,
    fileType: {
      default: () => ["png", "jpeg", "jpg"],
      type: Array
    },
    size: {
      default: 1,
      type: Number
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      originalImgName: "",
      // progress:0,
      loading: false,
      isNew: false,
      isPdf: false,
      fileObj: null
    };
  },
  computed: {
    fileTypeText() {
      return this.fileType.join("/");
    },
    currFile() {
      const { fileObj, file } = this;
      if (fileObj) return fileObj;
      return file && file.url ? file : null;
    }
  },
  methods: {
    reset() {
      this.fileObj = null;
    },
    handleProgress(event, file, fileList) {
      this.$emit("progress", event, file, fileList);
    },
    handleError(err, file, fileList) {
      this.loading = false;
      this.$emit("error", err, file, fileList);
    },
    handleSuccess(res, file) {
      let url = URL.createObjectURL(file.raw);
      this.fileObj = {
        ...file,
        url,
        name: res.name || Date.now() + ".png",
        completeUrl: res.url
      };
      this.$emit("success", this.fileObj);
      this.$emit("upload:success", this.fileObj);
      this.loading = false;
    },
    beforeUpload(file) {
      let isRightFileType = false;
      if (this.fileType.length > 0) {
        this.fileType.forEach(v => {
          isRightFileType = isRightFileType || file.type.indexOf(v) > -1;
        });
      } else {
        isRightFileType = true;
      }

      let isLessThanSize = file.size / 1024 / 1024 < this.size;

      if (!isRightFileType) {
        this.$message.error(`The file format of ${file.name} was incorrect.`);
      }
      if (!isLessThanSize) {
        this.$message.error(
          `The file is too large. Do not upload a file larger than ${this.size}M!`
        );
      }
      this.loading = isRightFileType && isLessThanSize;
      return isRightFileType && isLessThanSize;
    },
    onPreview() {
      this.$emit("preview", this.currFile);
    }
  }
};
</script>
