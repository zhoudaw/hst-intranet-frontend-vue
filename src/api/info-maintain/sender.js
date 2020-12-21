import request from "@/utils/request";
// 发件人
export default {
  list: params => request.post("/api/base/baseSender/list", params),
  detail: id => request.get(`/api/base/baseSender/detail/${id}`),
  create: params => request.post("/api/base/baseSender", params),
  update: params => request.put("/api/base/baseSender", params),
  /**
   * 删除
   * @param id
   */
  remove: id => request.delete(`/api/base/baseSender/${id}`),
  listAll: () => request.get("/api/base/baseSender/all")
};
