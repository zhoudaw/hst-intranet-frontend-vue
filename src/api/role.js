import request from "@/utils/request";
export default {
  // role列表
  list: params => request.post("/api/role/list", params),
  // 新增role
  create: params => request.post(`/api/role/create`, params),
  // 角色名校验
  checkName: params => request.post("/api/role/check/name", params),
  // 更新role
  update: params => request.put(`/api/role/update`, params),
  // 删除role
  remove: id => request.delete(`/api/role/delete/${id}`),
  // 权限All
  permissionTreeList: params => request.get(`/api/navigation/list/all`, params),
  // role detail
  detail: id => request.get(`/api/role/detail/${id}`),
  listAll: () => request.get("/api/role/list/all")
};
