import request from "@/utils/request";
// 国别
export default {
  list: params => request.post("/api/base/baseState/list", params),
  detail: id => request.get(`/api/base/baseState/detail/${id}`),
  create: params => request.post("/api/base/baseState", params),
  update: params => request.put("/api/base/baseState", params),
  remove: id => request.delete(`/api/base/baseState/${id}`),
  listAll: () => request.get("/api/base/baseState/all")
};
