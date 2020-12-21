import request from "@/utils/request";
// 报关种类
export default {
  list: params =>
    request.post("/api/base/baseDeclarationCategory/list", params),
  detail: id => request.get(`/api/base/baseDeclarationCategory/detail/${id}`),
  create: params => request.post("/api/base/baseDeclarationCategory", params),
  update: params => request.put("/api/base/baseDeclarationCategory", params),
  remove: id => request.delete(`/api/base/baseDeclarationCategory/${id}`),
  listAll: () => request.get("/api/base/baseDeclarationCategory/all")
};
