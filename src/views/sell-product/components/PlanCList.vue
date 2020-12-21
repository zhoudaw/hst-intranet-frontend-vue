<template>
  <div>
    <div class="mb1 clearfix">
      <div class="float-right">
        <el-link
          :href="planDownloadConfigTemplate"
          :underline="false"
          type="primary"
          target="_blank"
          style="font-size: 12px; font-weight: normal;vertical-align: inherit;"
          class="mr1"
        >
          下载模板
        </el-link>
        <upload-execl :plan-id="data.id" @success="uploadSuccess" />
      </div>
    </div>
    <el-table
      :data="pagination(pageNo, pageSize, configList)"
      style="width: 100%"
      max-height="600"
    >
      <el-table-column prop="weightForm" label="开始重量" min-width="100" />
      <el-table-column prop="weightTo" label="截止重量" min-width="100" />
      <el-table-column prop="price" label="价格" min-width="100" />
      <el-table-column prop="ruleTypeName" label="计重规则" min-width="100" />
    </el-table>
    <div class="table-footer">
      <el-pagination
        layout="total,prev,pager,next,jumper"
        background
        :total="configList.length"
        :page-size="pageSize"
        :current-page.sync="pageNo"
      />
    </div>
  </div>
</template>
<script>
import api from "@/api/sell-product";
import UploadExecl from "./UploadExecl";
import { pagination } from "@/utils";
export default {
  components: {
    UploadExecl
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      planDownloadConfigTemplate: api.planDownloadConfigTemplate,
      pageNo: 1,
      pageSize: 10
    };
  },
  computed: {
    configList() {
      const { configList } = this.data;
      return configList || [];
    }
  },
  methods: {
    pagination,
    uploadSuccess() {
      this.$emit("upload-success");
    }
  }
};
</script>
