import Vue from "vue";
import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./plugins/element";
import "./plugins/viewer";
import "./styles/index.scss"; // global css
import "./permission"; // permission control
import "./utils/error-log"; // error log
import "./icons"; // icon
import * as filters from "./filters"; // global filters
import Empty from "./components/Empty";
import { resetFields } from "./utils";

Vue.use(Empty);
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.prototype.$resetFields = resetFields;

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
