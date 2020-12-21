import Vue from "vue";
import Element from "element-ui";
import "../styles/element-variables.scss";

Vue.use(Element, {
  size: localStorage.getItem("size") || "small"
});
