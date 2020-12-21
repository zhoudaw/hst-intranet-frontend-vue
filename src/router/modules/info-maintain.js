import Layout from "@/layout";
export default {
  path: "/info-maintain",
  component: Layout,
  meta: { title: "信息维护", icon: "info-maintain" },
  redirect: "/info-maintain/list",
  // redirect: "noRedirect",
  children: [
    {
      hidden: true,
      path: "list",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/index"
        ),
      name: "InfoMaintain",
      meta: { title: "总览", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "sender",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/sender/index"
        ),
      name: "InfoMaintainSender",
      meta: { title: "发件人", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "state",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/state/index"
        ),
      name: "InfoMaintainState",
      meta: {
        title: "国别",
        desc: "发件人国别、收件人国别、贸易国别、产销国",
        activeMenu: "/info-maintain"
      }
    },
    {
      hidden: true,
      path: "unit",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/unit/index"
        ),
      name: "InfoMaintainUnit",
      meta: {
        title: "计量单位",
        desc: "申报计量单位、第一（法定）计量单位",
        activeMenu: "/info-maintain"
      }
    },
    {
      hidden: true,
      path: "product-code",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/product-code/index"
        ),
      name: "InfoMaintainProductCode",
      meta: { title: "商品编码", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "currency",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/currency/index"
        ),
      name: "InfoMaintainCurrency",
      meta: { title: "币制", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "declare-unit-category",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/declare-unit-category/index"
        ),
      name: "InfoMaintainDeclareUnitCategory",
      meta: { title: "申报单位类别", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "regulatory-way",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/regulatory-way/index"
        ),
      name: "InfoMaintainRegulatoryWay",
      meta: { title: "监管方式", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "classification-of-tax-exemptions",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/classification-of-tax-exemptions/index"
        ),
      name: "InfoMaintainClassificationOfTaxExemptions",
      meta: { title: "征免性质分类", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "clinch-way",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/clinch-way/index"
        ),
      name: "InfoMaintainClinchWay",
      meta: { title: "成交方式", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "tax-exemption-way",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/tax-exemption-way/index"
        ),
      name: "InfoMaintainTaxExemptionWay",
      meta: { title: "征减免税方式", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "pier-yard-code",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/pier-yard-code/index"
        ),
      name: "InfoMaintainPierYardCode",
      meta: { title: "码头/货场代码", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "customer",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/customer/index"
        ),
      name: "InfoMaintainCustomer",
      meta: {
        title: "客户名称",
        desc: "例：广州鑫诺",
        activeMenu: "/info-maintain"
      }
    },
    {
      hidden: true,
      path: "send-receive",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/send-receive/index"
        ),
      name: "InfoMaintainSendReceive",
      meta: { title: "收发货人名称", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "packing-type",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/packing-type/index"
        ),
      name: "InfoMaintainPackingType",
      meta: { title: "包装种类", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "declaration-category",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/declaration-category/index"
        ),
      name: "InfoMaintainDeclarationCategory",
      meta: { title: "报关类别", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "home-delivery",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/home-delivery/index"
        ),
      name: "InfoMaintainHomeDelivery",
      meta: { title: "宅配商", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "home-delivery-sender",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/home-delivery-sender/index"
        ),
      name: "InfoMaintainHomeDeliverySender",
      meta: { title: "宅配段寄件人", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "customs-code",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/customs-code/index"
        ),
      name: "InfoMaintainCustomsCode",
      meta: { title: "海关关区代码", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "check-quarantine-agency-code",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/check-quarantine-agency-code/index"
        ),
      name: "InfoMaintainCheckQuarantineAgencyCode",
      meta: { title: "检验检疫机构代码", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "state-administrative-code",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/state-administrative-code/index"
        ),
      name: "InfoMaintainStateAdministrativeCode",
      meta: { title: "国家行政区划代码", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "transport-code",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/transport-code/index"
        ),
      name: "InfoMaintainTransportCode",
      meta: { title: "运输方式代码", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "check-quarantine-packaging-code",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/check-quarantine-packaging-code/index"
        ),
      name: "InfoMaintainCheckQuarantinePackagingCode",
      meta: { title: "检验检疫包装种类代码", activeMenu: "/info-maintain" }
    },
    {
      hidden: true,
      path: "pod-code",
      component: () =>
        import(
          /* webpackChunkName: "info-maintain" */ "@/views/info-maintain/pod-code/index"
        ),
      name: "InfoMaintainPodCode",
      meta: { title: "指运港代码", activeMenu: "/info-maintain" }
    }
  ]
};
