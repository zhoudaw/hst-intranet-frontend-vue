import axios from "./";
export default {
  // 列表
  list: params => axios.post("/api/company/list", params),
  // 详情
  detail: params => axios.get(`/api/company/detail/${params.id}`, params),
  // 创建
  create: params => axios.post("/api/company", params),
  // 更新
  update: params => axios.put("/api/company", params),
  // 冻结/解冻
  freezingOrThawing: params => axios.put("/api/company/disable", params)
};
