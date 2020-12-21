import request from "@/utils/request";
export default {
  login: params => request.post("/api/login", params),
  list: params => request.post("/api/user/list", params),
  detail: params => request.get("/api/user/detail", params),
  remove: id => request.delete(`/api/user/delete/${id}`),
  // 冻结/激活
  freezeOrActivate: params => request.put("/api/user/disable", params),
  // 更新人员
  update: params => request.put("/api/user/update", params),
  // 新增人员
  create: params => request.post("/api/user/create", params),
  // 人员校验
  check: params => request.post("/api/user/check", params)
};
