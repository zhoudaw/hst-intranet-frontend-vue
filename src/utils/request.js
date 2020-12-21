import axios from "axios";
import { Message } from "element-ui";
import router from "@/router";
import { saveAs } from "file-saver";
// const { NODE_ENV } = process.env;
// const __PRO__ = NODE_ENV === "production";
// console.log({ __PRO__ });
// create an axios instance
const service = axios.create({
  timeout: 60 * 1000
});

// request interceptor
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // do something with request error
    // console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => response,
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  ({ response }) => {
    Message.closeAll();
    if (response) {
      const { status, data, message } = response;
      switch (status) {
        case 401:
          if (router.currentRoute.fullPath.indexOf("redirect") != -1) break; //处理多次请求，redirect重复问题
          router.replace({
            path: "/login",
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          Message.error("登录过期,请重新登录 :)");
          break;
        case 403:
          Message.error("Permission denied :)");
          break;
        case 500:
          Message.error(data.message || "系统异常，请联系管理员 :)");
          break;
        case 502:
          Message.error(data.message || "系统正在重启，请稍后再试 :)");
          break;
        case 503:
          Message.error(data.message || "服务暂时不可用 :)");
          break;
        case 504:
          Message.error(data.message || "系统繁忙，请稍后再试 :)");
          break;
        default:
          Message.error(message || data.message);
      }
      return Promise.reject(response.data);
    }
    return Promise.reject({ message: "Request fail!" }); // 返回接口返回的错误信息
  }
);
service.downloadExcel = async (url, params = {}) => {
  try {
    const { data, headers } = await service.get(url, {
      responseType: "blob",
      ...params
    });
    let blob = new Blob([data], {
      type: "application/vnd.ms-excel;charset=utf-8"
    });
    const contentDisposition = headers["content-disposition"];
    if (contentDisposition) {
      let filename = (
        contentDisposition.split(";").find(v => v.includes("filename=")) || ""
      ).replace("filename=", "");
      saveAs(blob, decodeURIComponent(filename));
      return true;
    }
    saveAs(blob, "excel.xlsx");
    return true;
  } catch (error) {
    return { error };
  }
};
export default service;
