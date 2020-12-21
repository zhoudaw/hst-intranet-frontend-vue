import request from "@/utils/request";
// 宅配段寄件人
export default {
  list: params => request.post("/api/base/baseDeliverySender/list", params),
  detail: id => request.get(`/api/base/baseDeliverySender/detail/${id}`),
  create: params => request.post("/api/base/baseDeliverySender", params),
  update: params => request.put("/api/base/baseDeliverySender", params),
  remove: id => request.delete(`/api/base/baseDeliverySender/${id}`),
  listAll: () => request.get("/api/base/baseDeliverySender/all")
};
