import axios from "./";
export default {
  /**
   * tianmao
   */
  // list
  requestOrderList: params => axios.post("/api/requestOrder/list", params),
  // create
  requestOrderCreate: params => axios.post("/api/requestOrder", params),
  // detail
  requestOrderDetail: params =>
    axios.get(`/api/requestOrder/${params.id}`, params),
  /**
   * backstage
   */
  // list
  orderRequestOrderList: params =>
    axios.post(`/api/order/requestOrder/list`, params),
  // update
  requestOrderUpdate: params => axios.put("/api/order/requestOrder", params),
  // create
  orderRequestOrderCreate: params =>
    axios.post("/api/order/requestOrder", params)
};
