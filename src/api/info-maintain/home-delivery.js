import request from "@/utils/request";
// 宅配商
export default {
  list: params => request.post("/api/base/baseDeliveryVendor/list", params),
  detail: id => request.get(`/api/base/baseDeliveryVendor/detail/${id}`),
  create: params => request.post("/api/base/baseDeliveryVendor", params),
  update: params => request.put("/api/base/baseDeliveryVendor", params),
  remove: id => request.delete(`/api/base/baseDeliveryVendor/${id}`),
  listAll: () => request.get("/api/base/baseDeliveryVendor/all")
};
