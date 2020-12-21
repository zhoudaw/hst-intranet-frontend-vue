import request from "@/utils/request";

export default {
  list: params => request.post("/api/baseOrderLogisticsMng/list", params),
  detail: id => request.get(`/api/base/baseOrder/${id}`),
  changeStatus: params =>
    request.post("/api/baseOrderLogisticsMng/changeStatus", params),
  goodsDetention: params =>
    request.post(`/api/baseOrderLogisticsMng/customsDetain`, params)
};
