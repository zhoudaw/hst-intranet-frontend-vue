import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/basePier/list", params),
  detail: id => request.get(`/api/base/basePier/detail/${id}`),
  create: params => request.post("/api/base/basePier", params),
  update: params => request.put("/api/base/basePier", params),
  remove: id => request.delete(`/api/base/basePier/${id}`),
  listAll: () => request.get("/api/base/basePier/all")
};
