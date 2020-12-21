import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseCustoms/list", params),
  detail: id => request.get(`/api/base/baseCustoms/detail/${id}`),
  create: params => request.post("/api/base/baseCustoms", params),
  update: params => request.put("/api/base/baseCustoms", params),
  remove: id => request.delete(`/api/base/baseCustoms/${id}`),
  listAll: () => request.get("/api/base/baseCustoms/all")
};
