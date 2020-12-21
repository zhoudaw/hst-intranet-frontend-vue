import request from "@/utils/request";
// 客户名称
export default {
  list: params => request.post("/api/base/baseCustomer/list", params),
  detail: id => request(`/api/base/baseCustomer/detail/${id}`),
  create: params => request.post("/api/base/baseCustomer", params),
  update: params => request.put("/api/base/baseCustomer", params),
  remove: id => request.delete(`/api/base/baseCustomer/${id}`),
  listAll: () => request.get("/api/base/baseCustomer/all"),
  baseListAll: () => request.get("/api/base/baseCustomer/list/all"),
  decUserList: () => request.get("/api/baseDeclarationUser/list/all")
};
