import Album from "./Album.vue";
import "./style.scss";

Album.install = function(Vue) {
  Vue.component(Album.name, Album);
};

export default Album;
