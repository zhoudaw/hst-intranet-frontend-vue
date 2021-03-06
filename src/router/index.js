import Vue from "vue";
import VueRouter from "vue-router";
import { constantRoutes } from "./routes";

Vue.use(VueRouter);

const createRouter = () =>
  new VueRouter({
    mode: "history", // require service support
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
