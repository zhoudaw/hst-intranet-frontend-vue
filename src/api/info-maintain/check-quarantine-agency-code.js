import request from "@/utils/request";

export default {
  list: params => request.post("/api/base/baseCheckStation/list", params),
  detail: id => request.get(`/api/base/baseCheckStation/detail/${id}`),
  create: params => request.post("/api/base/baseCheckStation", params),
  update: params => request.put("/api/base/baseCheckStation", params),
  remove: id => request.delete(`/api/base/baseCheckStation/${id}`),
  listAll: () => request.get("/api/base/baseCheckStation/all")
};
