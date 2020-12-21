import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseLevyExemption/list", params),
  detail: id => request.get(`/api/base/baseLevyExemption/detail/${id}`),
  create: params => request.post("/api/base/baseLevyExemption", params),
  update: params => request.put("/api/base/baseLevyExemption", params),
  remove: id => request.delete(`/api/base/baseLevyExemption/${id}`),
  listAll: () => request.get("/api/base/baseLevyExemption/all")
};
