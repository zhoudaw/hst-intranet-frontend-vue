import SingleUpload from "./main";
import "./style.scss";
SingleUpload.install = function(Vue) {
  Vue.component(SingleUpload.name, SingleUpload);
};

export default SingleUpload;
