import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseLevyExemptionWay/list", params),
  detail: id => request.get(`/api/base/baseLevyExemptionWay/detail/${id}`),
  create: params => request.post("/api/base/baseLevyExemptionWay", params),
  update: params => request.put("/api/base/baseLevyExemptionWay", params),
  remove: id => request.delete(`/api/base/baseLevyExemptionWay/${id}`),
  listAll: () => request.get("/api/base/baseLevyExemptionWay/all")
};
