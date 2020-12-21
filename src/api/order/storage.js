import request from "@/utils/request";

export default {
  // 列表
  list: params => request.post("/api/base/baseOrder/list", params),
  // 入库
  putStorage: params => request.put("/api/base/baseOrder/putStorage", params),
  // 详情
  detail: id => request.get(`/api/base/baseOrder/${id}`),
  // 创建
  create: params => request.post("/api/base/baseOrder", params),
  // 更新
  update: params => request.put("/api/base/baseOrder", params),
  // 删除
  remove: id => request.delete(`/api/base/baseOrder/${id}`),
  createData: () => request.get("/api/base/baseOrder/createData"),
  // 搜索邮寄地点
  searchDeliveryAddress: (text = "") =>
    request.post("/api/base/baseOrder/searchDeliveryAddress", {
      alikeDeliveryAddress: text
    }),
  /**
   * 打印
   * @param idList[String]
   */
  printShippingAgentV2: params =>
    request.post("/api/base/baseOrderPrint/shippingAgentV2", params),
  // 出口平潭单
  printExportPingTanV2: params =>
    request.post("/api/base/baseOrderPrint/exportPingTanV2", params),
  // 本地打印
  printShippingAgent: params =>
    request.post("/api/base/baseOrderPrint/shippingAgent", params),
  // 本地打印出口平潭单
  printExportPingTan: params =>
    request.post("/api/base/baseOrderPrint/exportPingTan", params),
  // 宅配单
  printHomeDelivery: params =>
    request.post("/api/base/baseOrderPrint/homeDelivery", params),
  // 可并单列表
  mergeList: params => request.post("/api/base/baseOrder/merge/list", params),
  // 批次订单列表
  cebList: params => request.post("/api/base/baseOrder/cebList", params),
  // 并单
  actionMerge: params =>
    request.post("/api/base/baseOrder/action/merge", params),
  // 获取有订单的客户列表
  haveOrderList: params =>
    request.get("/api/base/baseCustomer/haveOrderList", params),
  // 获取并单真实收件人筛选列表
  realReceiverList: id => request.get(`/api/base/baseOrder/realReceiver/${id}`),
  // 获取提单列表
  blListAll: () => request.get("/api/billsOfLading/list/all"),
  // 移至提单
  toBillsOfLading: params =>
    request.put("/api/base/baseOrder/toBillsOfLading", params),
  // 商品规格搜索
  hscodeByName: params => request.post("/api/hscode/search/byName", params),
  // 拆单
  actionSplit: params =>
    request.post("/api/base/baseOrder/action/split", params),
  // 导入
  importExcel: "/api/base/baseOrder/importExcel",
  // 下载
  downloadExcel: "/api/base/baseOrder/downloadExcel",
  batchRemove: params =>
    request.delete("/api/base/baseOrder/batchDelete", { data: params }),
  baseOrderExport: idList => `/api/base/baseOrder/export?idList=${idList}`,
  baseOrderAllExport: params => `/api/base/baseOrder/export?${params}`,
  export: params =>
    request.downloadExcel(`/api/base/baseOrder/export`, { params }),
  exportAll: params =>
    request.downloadExcel(`/api/base/baseOrder/export`, { params }),

  // baseOrderAllExport: params => `/api/base/baseOrder/export?advancedSearch=${params.advancedSearch}&aCreateDate=${params.aCreateDate}&aPutStorageDate=${params.aPutStorageDate}&aBaseCustomerIdList=${params.aBaseCustomerIdList}&aRealReceiver=${params.aRealReceiver}&aDeclareUser=${params.aDeclareUser}&aDeclareUserIdCard=${params.aDeclareUserIdCard}&aGoodsName=${params.aGoodsName}&aGoodsIdCode=${params.aGoodsIdCode}&aOrderIdList=${params.aOrderIdList}&aLogisticsNoList=${params.aLogisticsNoList}&aExpressNoList=${params.aExpressNoList}&aLogistics=${params.aLogistics}&aExpressCompany=${params.aExpressCompany}&aStatus=${params.aStatus}&aDesc=${params.aDesc}`,
  batchUpdate: "/api/base/baseOrder/batchUpdate",
  shuoHangUpdate: "/api/base/baseOrder/shuoHang/importExcel",
  shuoHangExcelImport: "/api/base/baseOrder/downloadShuoHangExcel",
  copy: id => request.post(`/api/base/baseOrder/copy/${id}`, {}),
  toBillsOfLadingList: idList =>
    request.post("/api/base/baseOrder/toBillsOfLadingList", {
      idList: idList || {}
    }),
  updateVerifyToBillsOfLadingInfo: params =>
    request.post("/api/base/baseOrder/updateVerifyToBillsOfLadingInfo", params),
  listByCustomerId: customerId =>
    request.get(`/api/baseDeclarationUser/listByCustomerId/${customerId}`),
  listByOrder: baseOrderId =>
    request.get(`/api/baseOrderGoods/listByOrder/${baseOrderId}`),
  updatePrice: params => request.put("/api/baseOrderGoods/updatePrice", params)
  // 空运
};
