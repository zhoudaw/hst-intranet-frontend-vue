import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/basePod/list", params),
  detail: id => request.get(`/api/base/basePod/detail/${id}`),
  create: params => request.post("/api/base/basePod", params),
  update: params => request.put("/api/base/basePod", params),
  remove: id => request.delete(`/api/base/basePod/${id}`),
  listAll: () => request.get("/api/base/basePod/all")
};
