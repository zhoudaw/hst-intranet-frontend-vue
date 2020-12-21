import request from "@/utils/request";

export default {
  // 账单列表
  list: params => request.post("/api/customerBills/list", params),
  // 账单详情
  detail: id => request.get(`/api/customerBills/${id}`),
  // 账单明细列表
  orderBillsList: (id, params) =>
    request.post(`/api/customerBills/${id}/orderBillsList`, params),
  // 修改明细金额
  orderBillsUpdateAmount: params =>
    request.post("/api/customerBills/orderBills/updateAmount", params),
  // 账单审核
  approval: params => request.post("/api/customerBills/approval", params),
  // 账单支付
  pay: params => request.post("/api/customerBills/pay", params),
  // 导出账单列表
  export: params =>
    request.downloadExcel("/api/customerBills/list/export", { params }),
  // 作废
  invalid: id => request.put(`/api/customerBills/invalid/${id}`)
};
