import request from "@/utils/request";

export default {
  airData: () => request.get("/api/base/baseOrderAirMng/create/data"),
  putStorage: params =>
    request.put("/api/base/baseOrderAirMng/putStorage", params),
  list: params => request.post("/api/base/baseOrderAirMng/list", params),
  importExcel: "/api/base/baseOrderAirMng/shuoHang/importExcel",
  downloadExcel: "/api/base/baseOrderAirMng/downloadShuoHangExcel",
  toBillsOfLading: params =>
    request.put("/api/base/baseOrderAirMng/toBillsOfLading", params),
  detail: id => request.get(`/api/base/baseOrderAirMng/${id}`),
  remove: id => request.delete(`/api/base/baseOrderAirMng/${id}`),
  update: params => request.put("/api/base/baseOrderAirMng", params),
  airCheck: params => request.put("/api/base/baseOrderAirMng/check", params)
};
