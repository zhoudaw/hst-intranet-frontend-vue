import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseSendReceive/list", params),
  detail: id => request.get(`/api/base/baseSendReceive/detail/${id}`),
  create: params => request.post("/api/base/baseSendReceive", params),
  update: params => request.put("/api/base/baseSendReceive", params),
  remove: id => request.delete(`/api/base/baseSendReceive/${id}`),
  listAll: () => request.get("/api/base/baseSendReceive/all")
};
