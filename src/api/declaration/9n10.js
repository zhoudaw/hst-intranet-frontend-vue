import request from "@/utils/request";

export default {
  // 订单模板详情
  cebOrderById: declaration9610Id =>
    request(`/api/declaration9610/getOrderCommonInfo/${declaration9610Id}`),
  cebOrderByIdList: params =>
    request.post("/api/declaration9610/order/list", {
      data: params || {}
    }),
  /**
   * @description:
   * @param {Integer} id
   * @param {Integer} cebJobId
   * @param {String} ebpName 电商平台名称
   * @param {String} ebcName 电商企业名称
   * @param {String} payName
   * @param {Integer} payCode
   * @param {Integer} payNo
   * @param {String} orderCurrency
   * @param {String} currency
   * @param {String} accountingDate
   * @param {Integer} totalFreight
   * @param {String} desc
   */
  updateCebOrder: params =>
    request.put("/api/declaration9610/OrderCommonInfoUpdate", {
      data: params || {}
    }),
  // 下载模板
  cebOrderDownload: declaration9610Id =>
    `/api/declaration9610/order/download/${declaration9610Id}`,
  // 清单模板详情
  cebInventoryById: declaration9610Id =>
    request(`/api/declaration9610/getInventoryCommonInfo/${declaration9610Id}`),
  cebInventoryByIdList: params =>
    request.post("/api/declaration9610/inventory/list", {
      data: params || {}
    }),
  /**
   * @description:
   * @param {Integer} id
   * @param {Integer} cebJobId
   * @param {String} customsCode
   * @param {String} tradeMode
   * @param {String} billNo
   * @param {String} voyageNo
   * @param {String} trafName
   * @param {String} trafMode
   * @param {String} ieDate
   * @param {String} portCode
   * @param {String} ebpName
   * @param {String} logisticsName
   * @param {String} agentName
   * @param {String} loctNo
   * @param {String} statisticsFlag
   * @param {String} fCurrency
   * @param {String} fFlag
   * @param {String} ebcCode
   * @param {String} ownerCode
   * @param {String} ownerName
   * @param {String} aCountry
   * @param {String} pod
   * @param {String} dCountry
   * @param {String} currency
   * @param {BigDecimal} totalFreight
   */
  updateCebInventory: params =>
    request.put("/api/declaration9610/InventoryCommonInfoUpdate", {
      data: params || {}
    }),
  // 下载模板
  cebInventoryDownload: declaration9610Id =>
    `/api/declaration9610/inventory/download/${declaration9610Id}`,
  // 运单模板详情
  cebWayBillById: declaration9610Id =>
    request(`/api/declaration9610/getWayBillCommonInfo/${declaration9610Id}`),
  cebWayBillByIdList: params =>
    request.post("/api/declaration9610/wayBill/list", {
      data: params || {}
    }),
  /**
   * @description:
   * @param {Integer} id
   * @param {Integer} cebJobId
   * @param {String} billNo
   * @param {String} ebpCode
   * @param {String} ebpName
   * @param {String} ebcCode
   * @param {String} ebcName
   * @param {String} currency
   * @param {String} logisticsCode
   * @param {String} logisticsName
   * @param {String} trafMode
   * @param {String} trafName
   * @param {String} payCode
   * @param {String} payName
   * @param {String} payNo
   * @param {String} agentCode
   * @param {String} agentName
   * @param {String} ownerCode
   * @param {String} ownerName
   * @param {String} country
   * @param {String} pod
   */
  updateCebWayBill: params =>
    request.put("/api/declaration9610/WayBillCommonInfoUpdate", {
      data: params || {}
    }),
  // 下载模板
  cebWayBillDownload: declaration9610Id =>
    `/api/declaration9610/wayBill/download/${declaration9610Id}`,
  nsozList: params =>
    request.post("/api/declaration9610/list", {
      data: params || {}
    }),
  nsozDetail: id => request(`/api/declaration9610/${id}`),
  nsozPintanDownload: declaration9610Id =>
    `/api/declaration9610/pingTan/download/${declaration9610Id}`,
  nsozPintanList: params =>
    request.post("/api/declaration9610/pingTan/list", {
      data: params || {}
    }),
  // 运单（真）
  logisticsWaybill: params =>
    request.post("/api/declaration9610/logisticsWaybill/list", {
      data: params || {}
    }),
  logisticsWaybillDownload: declaration9610Id =>
    `/api/declaration9610/LogisticsWaybill/download/${declaration9610Id}`,
  // GET /api/declaration9610/getLogisticsWayBillCommonInfo/{declaration9610Id}
  logWalBillUpdate: params =>
    request.put("/api/declaration9610/logisticsWaybillCommonInfoUpdate", {
      data: params || {}
    }),
  getLogWayBillInfo: declaration9610Id =>
    request(
      `/api/declaration9610/getLogisticsWayBillCommonInfo/${declaration9610Id}`
    )
};
