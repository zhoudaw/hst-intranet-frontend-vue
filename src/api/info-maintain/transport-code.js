import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseTransport/list", params),
  detail: id => request.get(`/api/base/baseTransport/detail/${id}`),
  create: params => request.post("/api/base/baseTransport", params),
  update: params => request.put("/api/base/baseTransport", params),
  remove: id => request.delete(`/api/base/baseTransport/${id}`),
  listAll: () => request.get("/api/base/baseTransport/all")
};
