import request from "@/utils/request";

export default {
  create: params => request.post("/api/expressProduct", params),
  update: params => request.put("/api/expressProduct", params),
  list: params => request.post("/api/expressProduct/list", params),
  detail: id => request.get(`/api/expressProduct/${id}`),
  remove: id => request.delete(`/api/expressProduct/${id}`),
  planCreate: params => request.post("/api/expressProduct/plan", params),
  planImportConfig: planId =>
    `/api/expressProduct/plan/config/import/${planId}`,
  planDownloadConfigTemplate: "/api/expressProduct/plan/config/template",
  planList: productCode =>
    request.post(`/api/expressProduct/plan/list/${productCode}`, {}),
  planRemove: id => request.delete(`/api/expressProduct/plan/${id}`),
  listAll: () => request.get("/api/expressProduct/list/all"),
  planListByProductCode: productCode =>
    request.get(`/api/expressProduct/${productCode}/planList`),

  planBConfigAll: productCode =>
    request.post(`/api/expressProduct/${productCode}/planBConfigAll`, {}),
  putPlanBConfig: params =>
    request.put("/api/expressProduct/planB/config", params),
  planBList: (productCode, params) =>
    request.post(`/api/expressProduct/${productCode}/planB/list`, params),
  addPlanB: params => request.post("/api/expressProduct/planB", params),
  putPlanB: params => request.put("/api/expressProduct/planB", params)
};
