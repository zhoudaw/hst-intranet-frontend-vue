<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="close"
    width="700px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" label-position="top">
      <el-form-item label="备注" prop="desc">
        <el-input
          v-model="form.desc"
          type="textarea"
          :rows="3"
          placeholder="请输入备注"
        />
      </el-form-item>
      <el-form-item prop="fileList">
        <el-upload
          ref="upload"
          action="#"
          accept="image/*"
          :file-list="form.fileList"
          list-type="picture"
          :before-upload="beforeUpload"
          :on-change="fileChange"
          :http-request="httpRequest"
          :disabled="uploading"
        >
          <el-button size="small" icon="el-icon-upload" :loading="uploading">
            上传附件
          </el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png图片，且不超过1mb
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button
        type="primary"
        @click="submit"
        :disabled="uploading"
        :loading="loading"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import request from "@/utils/request";
import api from "@/api/logistics-mgmt";

const imgTypes = ["image/jpeg", "image/jpg", "image/png"];
export default {
  data() {
    return {
      visible: false,
      loading: false,
      uploading: false,
      form: {
        operatorType: null,
        orderIdList: [],
        desc: null,
        fileList: []
      },
      isBatch: true
    };
  },
  computed: {
    ...mapGetters("common", ["ossUploadParams"]),
    title() {
      const { isBatch, form } = this;
      let title = "";
      switch (form.operatorType) {
        case "SHIPPING_STARTED":
          title = "装船";
          break;
        case "SHIPPING_ARRIVED":
          title = "到港";
          break;
        case "TW_CLEARANCE_NORMAL":
          title = "台湾清关";
          break;
        case "HOME_DELIVERY":
          title = "宅配";
          break;
        case "HOME_DELIVERY_COMPLETED":
          title = "完成宅配";
          break;
        case "CHINA_DECLARATION_EXCEPTION":
          title = "出口报关暂扣";
          break;
        case "TW_CLEARANCE_EXCEPTION":
          title = "台湾清关暂扣";
          break;
      }
      return `${isBatch ? "批量" : ""}${title}`;
    }
  },
  mounted() {
    this.outSysTime();
  },
  methods: {
    async show(type, idList = [], isBatch = true) {
      this.visible = true;
      this.isBatch = isBatch;
      this.form.operatorType = type;
      this.form.orderIdList = idList;
    },
    close() {
      this.visible = false;
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;
          const { fileList, ...form } = this.form;
          const imgList = fileList.map(({ name, uid }) => {
            let filetype = name.split(".").slice(-1)[0];
            return uid + "." + filetype;
          });
          await api.changeStatus({ ...form, imgList });
          this.$message.closeAll();
          this.$message.success(this.title + "成功");
          this.$emit("refresh");
          this.close();
        } finally {
          this.loading = false;
        }
      });
    },
    async outSysTime() {
      const { expire = 0 } = this.ossUploadParams;
      const sysTime = parseInt(new Date().getTime() / 1000);
      if (sysTime >= expire || sysTime - expire >= -60) {
        await this.$store.dispatch("common/getOssUploadParams");
      }
    },
    fileChange(file, fileList) {
      this.form.fileList = fileList.filter(v => v.status !== "fail");
    },
    beforeUpload(file) {
      const isJPG = imgTypes.includes(file.type);
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传图片只能是 jpg/png 格式!");
      }
      if (!isLt1M) {
        this.$message.error("图片大小不能超过1MB!");
      }
      return isJPG && isLt1M;
    },
    async httpRequest({ file, onSuccess, onError, onProgress }) {
      try {
        await this.outSysTime();
        const formData = new FormData();
        const { url, signature, appId, policy } = this.ossUploadParams;
        let filetype = file.name.split(".").slice(-1)[0];
        let filename = `${file.uid}.${filetype}`;
        file.filename = filename;
        formData.append("Filename", file.name); // 添加form表单中其他数据
        formData.append("key", `temp/${filename}`); // 添加form表单中其他数据
        formData.append("policy", policy); // 添加form表单中其他数据
        formData.append("OSSAccessKeyId", appId); // 添加form表单中其他数据
        formData.append("signature", signature); // 添加form表单中其他数据
        formData.append("file", file, file.name); // 通过append向form对象添加file对象
        formData.append("success_action_status", "200"); // 添加form表单中其他数据
        this.uploading = true;
        const res = await request.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data;charset=utf-8"
          },
          onUploadProgress: e => {
            let percentage = Math.round((e.loaded * 100) / e.total) || 0;
            file.percent = percentage;
            onProgress(file);
          }
        });
        file.response = res;
        onSuccess();
      } catch (e) {
        onError(e, file);
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>
