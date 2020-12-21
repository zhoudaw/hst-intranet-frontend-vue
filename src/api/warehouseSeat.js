import axios from "./";
export default {
  siteLocationList: params => axios.post("/api/siteLocation/list", params),
  siteLocationCreate: params => axios.post("/api/siteLocation", params),
  siteLocationDelete: params =>
    axios.delete(`/api/siteLocation/${params.id}`, params),
  siteLocationDetail: params =>
    axios.post(`/api/siteLocation/detail/${params.id}`, params),
  siteLocationUpdate: params => axios.put("/api/siteLocation", params),
  siteLocationCount: params => axios.post("/api/siteLocation/count", params),
  /** Ctg start */
  siteLocationCtgList: params =>
    axios.post("/api/siteLocationCtg/list", params),
  siteLocationCtgCreate: params => axios.post("/api/siteLocationCtg", params),
  siteLocationCtgUpdate: params => axios.put("/api/siteLocationCtg", params),
  siteLocationCtgDetail: params =>
    axios.get(`/api/siteLocationCtg/${params.id}`, params),
  siteLocationCtgDelete: params =>
    axios.delete(`/api/siteLocationCtg/${params.id}`, params)
  /** Ctg end */
};
