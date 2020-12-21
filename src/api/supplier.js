import axios from "./";
export default {
  supplierList: params => axios.post("/api/supplier/list", params),
  supplierCreate: params => axios.post("/api/supplier", params),
  supplierDetail: params =>
    axios.get(`/api/supplier/detail/${params.id}`, params),
  supplierUpdate: params => axios.put(`/api/supplier`, params)
};
