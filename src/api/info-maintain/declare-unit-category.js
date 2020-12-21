import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseUnitCategory/list", params),
  detail: id => request.get(`/api/base/baseUnitCategory/detail/${id}`),
  create: params => request.post("/api/base/baseUnitCategory", params),
  update: params => request.put("/api/base/baseUnitCategory", params),
  remove: id => request.delete(`/api/base/baseUnitCategory/${id}`),
  listAll: () => request.get("/api/base/baseUnitCategory/all")
};
