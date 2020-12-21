import request from "@/utils/request";
export default {
  // 列表
  list: params => request.post("/api/outlet/list", params),
  // 新增
  create: params => request.post("/api/outlet", params),
  // 详情
  detail: params => request.get(`/api/outlet/detail/${params.id}`, params),
  // 更新
  update: params => request.put(`/api/outlet`, params),
  // 删除
  remove: params => request.delete(`/api/outlet/${params.id}`, params),
  // hst列表
  hstList: params => request.post("/api/hstOutlet/list", params),
  // hst新增
  hstCreate: params => request.post("/api/hstOutlet", params),
  // hst详情
  hstDetail: params =>
    request.get(`/api/hstOutlet/detail/${params.id}`, params),
  // hst更新
  hstUpdate: params => request.put(`/api/hstOutlet`, params),
  // hst删除
  hstRemove: params => request.delete(`/api/hstOutlet/${params.id}`, params)
};
