import request from "@/utils/request";

export default {
  // 获取提单列表
  listAll: () => request.get("/api/billsOfLading/list/all")
};
