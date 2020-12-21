import request from "@/utils/request";

export default {
  list: params => request.post("/api/declaration3010/list", params),
  waiDaiList: params =>
    request.post("/api/declaration3010/waiDai/list", params),
  publicInfo: params => request.put("/api/declaration3010/publicInfo", params),
  yuanShengList: params =>
    request.post("/api/declaration3010/yuanSheng/list", params),
  detail: id => request.get(`/api/declaration3010/${id}`),
  waiDaiDownload: id => `/api/declaration3010/waiDai/download/${id}`,
  yuanShengDownload: id => `/api/declaration3010/yuanSheng/download/${id}`,
  cangDanList: params =>
    request.post("/api/declaration3010/cangDan/list", params),
  cangDanDownload: id => `/api/declaration3010/cangDan/download/${id}`,
  xieChengList: params =>
    request.post("/api/declaration3010/xieCheng/list", params),
  xieChengDownload: id => `/api/declaration3010/xieCheng/download/${id}`
};
