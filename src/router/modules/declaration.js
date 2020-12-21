import Layout from "@/layout";
import Empty from "@/views/empty/index";

export default {
  path: "/declaration",
  component: Layout,
  meta: { title: "报关业务", icon: "declaration" },
  redirect: "noRedirect",
  children: [
    {
      path: "9*10",
      component: () =>
        import(
          /* webpackChunkName: "declaration" */ "@/views/declaration/9n10/index"
        ),
      name: "Declaration9n10",
      meta: { title: "9610(9710/9810)申报" }
    },
    {
      path: "3010",
      component: () =>
        import(
          /* webpackChunkName: "declaration" */ "@/views/declaration/3010/list"
        ),
      name: "Declaration3010List",
      meta: { title: "3010申报" }
    },
    {
      path: "3010-ext",
      redirect: "/declaration/3010",
      component: Empty,
      hidden: true,
      meta: { title: "3010申报" },
      children: [
        {
          path: "/declaration/3010/outside-generation/:id",
          component: () =>
            import(
              /* webpackChunkName: "declaration" */ "@/views/declaration/3010/outside-generation"
            ),
          name: "Declaration3010OutsideGeneration",
          meta: {
            title: "外代报文",
            activeMenu: "/declaration/3010",
            noCache: false
          }
        }
      ]
    }
  ]
};
