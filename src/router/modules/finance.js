import Layout from "@/layout";
import Empty from "@/views/empty/index";

export default {
  path: "/finance",
  component: Layout,
  redirect: "noRedirect",
  meta: { title: "财务管理", icon: "finance" },
  children: [
    {
      path: "customer-bill",
      component: () =>
        import(
          /* webpackChunkName: "finance" */ "@/views/finance/customer-bill/index"
        ),
      name: "FinanceCustomerBill",
      meta: { title: "客户账单" }
    },
    {
      path: "customer-bill-ext",
      component: Empty,
      meta: { title: "客户账单" },
      redirect: "/finance/customer-bill",
      hidden: true,
      children: [
        {
          path: "/finance/customer-bill/detail/:id",
          component: () =>
            import(
              /* webpackChunkName: "finance" */ "@/views/finance/customer-bill/detail"
            ),
          name: "FinanceCustomerBillDetail",
          meta: {
            title: "客户账单明细",
            activeMenu: "/finance/customer-bill",
            noCache: false
          }
        }
      ]
    },
    {
      path: "collection",
      component: () =>
        import(
          /* webpackChunkName: "finance" */ "@/views/finance/collection/index"
        ),
      name: "FinanceCollection",
      meta: { title: "收款管理" }
    },
    {
      path: "collection-ext",
      component: Empty,
      meta: { title: "收款管理" },
      redirect: "/finance/collection",
      hidden: true,
      children: [
        {
          path: "/finance/collection/detail/:id",
          component: () =>
            import(
              /* webpackChunkName: "finance" */ "@/views/finance/collection/detail"
            ),
          name: "FinanceCollectionDetail",
          meta: {
            title: "收款费用明细",
            activeMenu: "/finance/collection",
            noCache: false
          }
        }
      ]
    }
  ]
};
