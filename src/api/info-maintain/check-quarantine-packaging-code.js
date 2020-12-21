import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseCheckWrap/list", params),
  detail: id => request.get(`/api/base/baseCheckWrap/detail/${id}`),
  create: params => request.post("/api/base/baseCheckWrap", params),
  update: params => request.put("/api/base/baseCheckWrap", params),
  remove: id => request.delete(`/api/base/baseCheckWrap/${id}`),
  listAll: () => request.get("/api/base/baseCheckWrap/all")
};
