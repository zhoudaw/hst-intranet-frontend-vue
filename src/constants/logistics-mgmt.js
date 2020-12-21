export const statusList = [
  { text: "创建", value: "CREATED" },
  { text: "已入库", value: "PUT_STORAGE" },
  { text: "已出库", value: "OUT_STORAGE" },
  { text: "出口报关放行", value: "CHINA_DECLARATION_NORMAL" },
  { text: "出口报关暂扣", value: "CHINA_DECLARATION_EXCEPTION" },
  { text: "已装船", value: "SHIPPING_STARTED" },
  { text: "已到港", value: "SHIPPING_ARRIVED" },
  { text: "台湾清关暂扣", value: "TW_CLEARANCE_EXCEPTION" },
  { text: "台湾清关放行", value: "TW_CLEARANCE_NORMAL" },
  // {
  //   text: '宅配中',
  //   value: 'HOME_DELIVERY_PROCESSING',
  // },
  { text: "宅配完成", value: "HOME_DELIVERY_COMPLETED" }
];
