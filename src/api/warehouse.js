import request from "@/utils/request";

export default {
  list: params => request.post("/api/warehouse/list", params),
  detail: id => request.get(`/api/warehouse/detail/${id}`),
  create: params => request.post("/api/warehouse", params),
  update: params => request.put("/api/warehouse", params),
  count: params => request.post("/api/warehouse/count", params),
  remove: id => request.delete(`/api/warehouse/${id}`)
};
