import request from "@/utils/request";

export default {
  // 列表
  list: params => request.post("/api/receipt/list", params),
  // 详情
  detail: id => request.get(`/api/receipt/${id}`),
  // 明细列表
  detailItemList: (id, params) =>
    request.post(`/api/receipt/${id}/itemList`, params),
  // 核销
  verify: params => request.post("/api/receipt/verify", params),
  // 作废
  invalid: params => request.post("/api/receipt/invalid", params),
  // 导出列表
  export: params =>
    request.downloadExcel("/api/receipt/list/export", { params })
};
