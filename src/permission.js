import router from "./router";
import store from "./store";
import getPageTitle from "@/utils/get-page-title";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
// NProgress Configuration
NProgress.configure({
  showSpinner: true,
  easing: "ease",
  speed: 350
});

const whiteList = ["/login"]; // no redirect whitelist

router.onReady(async () => {
  const user = localStorage.getItem("authority");
  if (user) {
    // router.addRoutes(asyncRoutes);
    // generate accessible routes map based on roles
    const accessRoutes = await store.dispatch("permission/generateRoutes", [
      "admin"
    ]);
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);
  }
});

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // set page title
  document.title = getPageTitle(to.meta.title);
  const user = localStorage.getItem("authority");
  if (user) {
    next();
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
