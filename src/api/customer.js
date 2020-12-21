import request from "@/utils/request";
export default {
  list: params => request.post("/api/customerMng/list", params),
  detail: id => request.get(`/api/customerMng/${id}`),
  create: params => request.post("/api/customerMng", params),
  update: params => request.put("/api/customerMng", params),
  freeCustomer: id => request.put(`/api/customerMng/free/${id}`),
  disabledCustomer: id => request.put(`/api/customerMng/disabled/${id}`),
  checkPhone: phone =>
    request.get(`/api/customerMng/checkIsExistPhone/${phone}`),
  checkAccount: account =>
    request.get(`/api/customerMng/checkIsExistAccount/${account}`),
  checkEmail: email =>
    request.get(`/api/customerMng/checkIsExistEmail/${email}`),
  checkName: name => request.get(`/api/customerMng/checkIsExistName/${name}`),
  customerMngParam: () => request.post("/api/customerMng/customerMngParam"),

  addExpressProduct: params =>
    request.post("/api/customerMng/expressProduct/add", params),
  updateExpressProduct: params =>
    request.put("/api/customerMng/expressProduct/update", params),
  removeExpressProduct: mappingId =>
    request.delete(`/api/customerMng/expressProduct/remove/${mappingId}`)
};
