import Layout from "@/layout";
import Empty from "@/views/empty/index";

export default {
  path: "/order",
  component: Layout,
  meta: { title: "订单管理", icon: "order" },
  redirect: "noRedirect",
  children: [
    {
      path: "storage",
      component: () =>
        import(/* webpackChunkName: "order" */ "@/views/order/storage/index"),
      name: "OrderStorage",
      meta: { title: "仓储订单", noCache: false }
    },
    {
      path: "storage-ext",
      redirect: "/order/storage",
      component: Empty,
      hidden: true,
      meta: { title: "仓储订单" },
      children: [
        {
          path: "/order/storage/create",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/storage/form"
            ),
          name: "OrderStorageCreate",
          meta: {
            title: "创建订单",
            activeMenu: "/order/storage",
            noCache: false
          }
        },
        {
          path: "/order/storage/update/:id",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/storage/form"
            ),
          name: "OrderStorageUpdate",
          meta: {
            title: "更新订单",
            activeMenu: "/order/storage",
            noCache: false
          }
        },
        {
          path: "/order/storage/detail/:id",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/storage/detail"
            ),
          name: "OrderStorageDetail",
          meta: {
            title: "订单详情",
            activeMenu: "/order/storage",
            noCache: false
          }
        },
        {
          path: "/order/storage/select-merge",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/storage/select-merge"
            ),
          name: "OrderStorageSelectMerge",
          meta: { title: "选择并单订单", activeMenu: "/order/storage" }
        },
        {
          path: "/order/storage/merge/update/:id",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/storage/merge-update"
            ),
          name: "OrderStorageMergeUpdate",
          meta: { title: "编辑并单订单", activeMenu: "/order/storage" }
        },
        {
          path: "/order/storage/split/first/:id",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/storage/split-first"
            ),
          name: "OrderStorageSplitFirst",
          meta: { title: "编辑拆单订单-1", activeMenu: "/order/storage" }
        },
        {
          path: "/order/storage/split/second/:prevId/:id",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/storage/split-second"
            ),
          name: "OrderStorageSplitSecond",
          meta: { title: "编辑拆单订单-2", activeMenu: "/order/storage" }
        }
      ]
    },
    {
      path: "express",
      component: () =>
        import(/* webpackChunkName: "order" */ "@/views/order/express/index"),
      name: "OrderExpress",
      meta: { title: "快递订单" }
    },
    {
      path: "express-ext",
      redirect: "/order/express",
      component: Empty,
      hidden: true,
      meta: { title: "快递订单" },
      children: [
        {
          path: "/order/express/create",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/express/form"
            ),
          name: "OrderExpressCreate",
          meta: {
            title: "创建订单",
            activeMenu: "/order/express",
            noCache: false
          }
        },
        {
          path: "/order/express/update/:id",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/express/form"
            ),
          name: "OrderExpressUpdate",
          meta: {
            title: "更新订单",
            activeMenu: "/order/express",
            noCache: false
          }
        },
        {
          path: "/order/express/detail/:id",
          component: () =>
            import(
              /* webpackChunkName: "order" */ "@/views/order/express/detail"
            ),
          name: "OrderExpressDetail",
          meta: {
            title: "订单详情",
            activeMenu: "/order/express",
            noCache: false
          }
        }
      ]
    }
  ]
};
