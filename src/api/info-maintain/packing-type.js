import request from "@/utils/request";
// 包装种类
export default {
  list: params => request.post("/api/base/basePackage/list", params),
  detail: id => request.get(`/api/base/basePackage/detail/${id}`),
  create: params => request.post("/api/base/basePackage", params),
  update: params => request.put("/api/base/basePackage", params),
  remove: id => request.delete(`/api/base/basePackage/${id}`),
  listAll: () => request.get("/api/base/basePackage/all")
};
