export { default as settleAccountsModeList } from "./settle-accounts-mode";
export { default as tariffPayList } from "./tariff-pay";
export { default as areaJson } from "./area.json";
export {
  storageStatus as storageOrderStatusListList,
  expressStatus as expressOrderStatusListList
} from "./order";
import areaJson from "./area.json";
const areaList = areaJson.filter(v => [1, 710000].includes(v.id));
export const taiwanArea = areaList[1];
export const chinaArea = [...areaList[0].children, taiwanArea];
export { settlementModeList } from "./customer";
export const payTypeList = [
  { text: "微信支付", value: 1 },
  { text: "支付宝支付", value: 2 },
  { text: "银联支付", value: 3 }
];
