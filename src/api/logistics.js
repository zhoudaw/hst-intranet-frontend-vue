import request from "@/utils/request";

export default {
  list: params => request.post("/api/logistics/list", params),
  detail: id => request.get(`/api/logistics/detail/${id}`),
  create: params => request.post("/api/logistics", params),
  update: params => request.put("/api/logistics", params),
  remove: id => request.delete(`/api/logistics/${id}`)
};
