import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseCompletedWay/list", params),
  detail: id => request.get(`/api/base/baseCompletedWay/detail/${id}`),
  create: params => request.post("/api/base/baseCompletedWay", params),
  update: params => request.put("/api/base/baseCompletedWay", params),
  remove: id => request.delete(`/api/base/baseCompletedWay/${id}`),
  listAll: () => request.get("/api/base/baseCompletedWay/all")
};
