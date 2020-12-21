/**
 * base_ceb_job
 * id
 * batchNo //批次号
 * exportDate //开航日期
 * orderSize //订单数量
 * status
 * base_ceb_job_item
 * id
 * baseJobId //批次id
 * baseOrderId //订单id
 * baseOrderGoodsId //商品id
 * num //序号
 * gNum //商品序号
 * freight //运费
 * itemNo //商品货号
 * accountingDate //收款时间
 * status
 * ------
 * base_ceb_order
 * baseJobId
 * ebpName //电商平台名称
 * ebcName //电商企业名称
 * payName //支付企业名称
 * payCode //支付企业代码
 * payNo   //支付交易编号
 * orderCurrency //订单币制
 * currency //币制
 * accountingDate //收款时间
 * totalFreight //总运费
 * desc //订单备注
s * tatus
 */

import request from "@/utils/request";
export default {
  /**
   * @description 列表
   * @param {String} alikeName
   */
  list: params => request.post("/api/base/baseCebJob/list", params),
  // 详情
  detail: id => request(`/api/base/baseCebJob/${id}`),
  /**
   * @param {Date} exportDate @NotNull
   * @param {List<String>} baseOrderIdList @NotEmpty
   * @param {Number} totalFreight @NotNull
   */
  create: params => request.post("/api/base/baseCebJob", params),
  update: params => request.put("/api/base/baseCebJob", params),
  remove: id => request.delete(`/api/base/baseCebJob/${id}`)
};
