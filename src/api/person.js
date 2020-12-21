import axios from "./";
export default {
  // 列表
  list: params => axios.post("/api/person/list", params),
  // 详情
  detail: params => axios.get(`/api/person/detail/${params.id}`, params),
  // 创建
  create: params => axios.post("/api/person", params),
  // 更新
  update: params => axios.put("/api/person", params),
  // 冻结/解冻
  freezingOrThawing: params => axios.put("/api/person/disable", params)
};
