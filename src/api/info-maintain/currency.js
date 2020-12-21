import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseCurrency/list", params),
  detail: id => request.get(`/api/base/baseCurrency/detail/${id}`),
  create: params => request.post("/api/base/baseCurrency", params),
  update: params => request.put("/api/base/baseCurrency", params),
  remove: id => request.delete(`/api/base/baseCurrency/${id}`),
  listAll: () => request.get("/api/base/baseCurrency/all")
};
