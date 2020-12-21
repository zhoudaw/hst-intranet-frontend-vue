import request from "@/utils/request";
// 商品编码
export default {
  list: params => request.post("/api/base/baseProductCode/list", params),
  detail: id => request.get(`/api/base/baseProductCode/detail/${id}`),
  create: params => request.post("/api/base/baseProductCode", params),
  update: params => request.put("/api/base/baseProductCode", params),
  remove: id => request.delete(`/api/base/baseProductCode/${id}`),
  listAll: () => request.get("/api/base/baseProductCode/all"),
  checkCode: params =>
    request.post(`/api/base/baseProductCode/check/code`, params),
  unitList: () => request.get("/api/base/baseUnit/all")
};
