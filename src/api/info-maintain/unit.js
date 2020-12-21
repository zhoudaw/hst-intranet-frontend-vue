import request from "@/utils/request";
// 发件人
export default {
  list: params => request.post("/api/base/baseUnit/list", params),
  detail: id => request.get(`/api/base/baseUnit/detail/${id}`),
  create: params => request.post("/api/base/baseUnit", params),
  update: params => request.put("/api/base/baseUnit", params),
  remove: id => request.delete(`/api/base/baseUnit/${id}`),
  listAll: () => request.get("/api/base/baseUnit/all")
};
