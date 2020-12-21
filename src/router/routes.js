import Layout from "@/layout";
import Empty from "@/views/empty/index";
import infoMaintainRoutes from "./modules/info-maintain";
import declarationRoutes from "./modules/declaration";
import orderRoutes from "./modules/order";
import financeRoutes from "./modules/finance";
const { VUE_APP_WEBSITE } = process.env;

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/index")
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "Dashboard", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/404",
    component: () =>
      import(/* webpackChunkName: "exception" */ "@/views/error-page/404")
  },
  {
    path: "/401",
    component: () =>
      import(/* webpackChunkName: "exception" */ "@/views/error-page/401")
  }
];
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/customer",
    component: Layout,
    children: [
      {
        path: "list",
        component: () =>
          import(/* webpackChunkName: "customer" */ "@/views/customer/index"),
        name: "CustomerList",
        meta: { title: "客户管理", icon: "customer" }
      },
      {
        path: "ext",
        redirect: "/customer/list",
        component: Empty,
        hidden: true,
        meta: { title: "客户管理" },
        children: [
          {
            path: "/customer/setting/:id",
            component: () =>
              import(
                /* webpackChunkName: "customer" */ "@/views/customer/setting"
              ),
            name: "CustomerSetting",
            meta: { title: "客户产品价格管理", activeMenu: "/customer/list" }
          }
        ]
      }
    ]
  },
  {
    path: "/sell-product",
    component: Layout,
    children: [
      {
        path: "list",
        component: () =>
          import(
            /* webpackChunkName: "sell-product" */ "@/views/sell-product/index"
          ),
        name: "SellProduct",
        meta: { title: "销售产品", icon: "sell-product", noCache: false }
      },
      {
        path: "ext",
        redirect: "/sell-product/list",
        component: Empty,
        hidden: true,
        meta: { title: "销售产品" },
        children: [
          {
            path: "/sell-product/setting/:productCode",
            component: () =>
              import(
                /* webpackChunkName: "sell-product" */ "@/views/sell-product/setting"
              ),
            name: "SellProductSetting",
            meta: { title: "价格配置", activeMenu: "/sell-product/list" }
          }
        ]
      }
    ]
  },
  {
    path: "/warehouse",
    component: Layout,
    children: [
      {
        path: "list",
        component: () =>
          import(/* webpackChunkName: "warehouse" */ "@/views/warehouse/index"),
        name: "Warehouse",
        meta: { title: "仓库管理", icon: "warehouse" }
      }
    ]
  },
  {
    path: "/logistics",
    component: Layout,
    children: [
      {
        path: "list",
        component: () =>
          import(/* webpackChunkName: "logistics" */ "@/views/logistics/index"),
        name: "Logistics",
        meta: { title: "物流商管理", icon: "logistics" }
      },
      {
        path: "ext",
        redirect: "/logistics/list",
        component: Empty,
        hidden: true,
        meta: { title: "物流商管理", icon: "logistics" },
        children: [
          {
            path: "/logistics/create",
            component: () =>
              import(
                /* webpackChunkName: "logistics" */ "@/views/logistics/form"
              ),
            name: "LogisticsCreate",

            meta: { title: "创建物流商", activeMenu: "/logistics/list" }
          },
          {
            path: "/logistics/update/:id",
            component: () =>
              import(
                /* webpackChunkName: "logistics" */ "@/views/logistics/form"
              ),
            name: "LogisticsUpdate",
            meta: { title: "更新物流商", activeMenu: "/logistics/list" }
          },
          {
            path: "/logistics/outlet/:id",
            component: () =>
              import(
                /* webpackChunkName: "logistics" */ "@/views/logistics/outlet/index"
              ),
            name: "LogisticsOutlet",
            meta: { title: "物流商网点管理", activeMenu: "/logistics/list" }
          }
        ]
        //
      }
    ]
  },
  infoMaintainRoutes,
  orderRoutes,
  {
    path: "/bl",
    component: Layout,
    children: [
      {
        path: "list",
        component: () =>
          import(/* webpackChunkName: "bl" */ "@/views/bl/index"),
        name: "Bl",
        meta: { title: "提单管理", icon: "bl" }
      }
    ]
  },
  declarationRoutes,
  {
    path: "/logistics-mgmt",
    component: Layout,
    children: [
      {
        path: "list",
        component: () =>
          import(
            /* webpackChunkName: "logistics-mgmt" */ "@/views/logistics-mgmt/index"
          ),
        name: "LogisticsMgmt",
        meta: { title: "物流管理", icon: "express", noCache: false }
      },
      {
        path: "ext",
        component: Empty,
        meta: { title: "物流管理" },
        redirect: "/logistics-mgmt/list",
        hidden: true,
        children: [
          {
            path: "/logistics-mgmt/detail/:id",
            component: () =>
              import(
                /* webpackChunkName: "logistics-mgmt" */ "@/views/logistics-mgmt/detail"
              ),
            name: "LogisticsMgmtDetail",
            meta: {
              title: "物流详情",
              activeMenu: "/logistics-mgmt/list",
              noCache: false
            }
          },
          {
            path: "/logistics-mgmt/withholding/:id",
            component: () =>
              import(
                /* webpackChunkName: "logistics-mgmt" */ "@/views/logistics-mgmt/withholding"
              ),
            name: "LogisticsMgmtWithholding",
            meta: {
              title: "暂扣",
              activeMenu: "/logistics-mgmt/list",
              noCache: false
            }
          }
        ]
      }
    ]
  },
  financeRoutes,
  {
    path: "/system",
    component: Layout,
    redirect: "noRedirect",
    meta: { title: "系统管理", icon: "setting" },
    children: [
      {
        path: "user",
        component: () =>
          import(/* webpackChunkName: "system" */ "@/views/system/user/index"),
        name: "SystemUser",
        meta: { title: "人员管理" }
      },
      {
        path: "role",
        component: () =>
          import(/* webpackChunkName: "system" */ "@/views/system/role/index"),
        name: "SystemRole",
        meta: { title: "角色管理" }
      }
    ]
  },
  {
    path: "/icon",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/icons/index"),
        name: "Icons",
        meta: { title: "Icons", icon: "icon" }
      }
    ]
  },
  {
    path: "external-link",
    component: Layout,
    meta: { title: "外链", icon: "link" },
    children: [
      {
        path: VUE_APP_WEBSITE,
        meta: { title: "前台站点" }
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];
