import adaptive from "./adaptive";
import loadmore from "./loadmore";
const install = function(Vue) {
  Vue.directive("el-height-adaptive-table", adaptive);
  Vue.directive("table-loadmore", loadmore);
};

if (window.Vue) {
  window["el-height-adaptive-table"] = adaptive;
  Vue.use(install); // eslint-disable-line
}

adaptive.install = install;
export default adaptive;
