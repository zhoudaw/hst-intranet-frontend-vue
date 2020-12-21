<template>
  <el-upload
    ref="upload"
    action="https://jsonplaceholder.typicode.com/posts/"
    list-type="picture"
    with-credentials
    :accept="accept"
    :limit="1"
    :file-list="fileList"
    :before-upload="beforeUpload"
    :on-success="onSuccess"
    :on-remove="onRemove"
    :on-exceed="onExceed"
  >
    <el-button size="small" type="primary" @click="onClickUpload">
      点击上传
    </el-button>
    <div slot="tip" class="el-upload__tip">
      只能上传{{ fileType.join("/") }}文件，且不超过{{ size }}M
    </div>
  </el-upload>
</template>
<script>
export default {
  props: {
    file: Object,
    fileType: {
      default: () => ["jpg", "png", "jpeg"],
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
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ]
    };
  },
  computed: {
    accept() {
      return this.fileType.map(v => "." + v).join(",");
    }
  },
  methods: {
    onClickUpload() {
      this.$refs.upload.clearFiles();
    },
    onSuccess(response, file, fileList) {
      // success
      this.fileList = fileList;
    },
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    onExceed(files, fileList) {
      console.log(files, fileList);
      // this.$refs.upload.submit();
    },
    beforeUpload(file) {
      let fileType = this.fileType.find(v => file.type.includes(v));
      if (!fileType) {
        this.$message.error(`${file.name}的文件格式不正确。`);
        return false;
      }
      let isLessThanSize = file.size / 1024 / 1024 < this.size;

      if (!isLessThanSize) {
        this.$message.error(`上传图片大小不能超过 ${this.size}M!`);
        return false;
      }
      // this.loading = true;
      return true;
    }
  }
};
</script>
