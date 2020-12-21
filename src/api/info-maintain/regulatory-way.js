import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseSupervise/list", params),
  detail: id => request.get(`/api/base/baseSupervise/detail/${id}`),
  create: params => request.post("/api/base/baseSupervise", params),
  update: params => request.put("/api/base/baseSupervise", params),
  remove: id => request.delete(`/api/base/baseSupervise/${id}`),
  listAll: () => request.get("/api/base/baseSupervise/all")
};
