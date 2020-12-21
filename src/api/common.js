import request from "@/utils/request";

export default {
  noAuthAllRoleList: () => request.get("/api/role/list/all"),
  // OSS上传参数
  ossUploadParams: () => request.get(`/api/upload/uploadParams`)
};
