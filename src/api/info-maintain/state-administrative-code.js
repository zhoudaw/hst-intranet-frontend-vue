import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseAdministrative/list", params),
  detail: id => request.get(`/api/base/baseAdministrative/detail/${id}`),
  create: params => request.post("/api/base/baseAdministrative", params),
  update: params => request.put("/api/base/baseAdministrative", params),
  remove: id => request.delete(`/api/base/baseAdministrative/${id}`),
  listAll: () => request.get("/api/base/baseAdministrative/all")
};
