const path = require("path");

const defaultSettings = require("./src/settings.js");
const { NODE_ENV, VUE_APP_API } = process.env;
const __PRO__ = NODE_ENV === "production";
console.log({ NODE_ENV, VUE_APP_API, __PRO__ });
function resolve(dir) {
  return path.join(__dirname, dir);
}
const cdn = {
  css: [
    "https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css",
    "https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.css"
    // "https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/theme-chalk/index.css"
    // "https://cdn.jsdelivr.net/npm/material-design-icons@3.0.1/iconfont/material-icons.css"
  ],
  js: [
    "https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.js",
    "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.runtime.min.js",
    "https://cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js",
    "https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js",
    "https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js",
    "https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/index.js",
    "https://cdn.jsdelivr.net/npm/dayjs@1.8.33/dayjs.min.js",
    "https://cdn.jsdelivr.net/npm/vue-meta@2.4.0/dist/vue-meta.min.js"
  ]
};
const title = defaultSettings.title || "海速通 | 海速跨境平台"; // page title

module.exports = {
  pwa: {
    manifestOptions: {
      name: "海速通 | 海速跨境平台",
      short_name: "海速通 | 海速跨境平台",
      background_color: "#ffffff",
      theme_color: "#91c42a"
    }
  },
  chainWebpack: config => {
    // 生产环境配置
    if (__PRO__) {
      // it can improve the speed of the first screen, it is recommended to turn on preload
      // it can improve the speed of the first screen, it is recommended to turn on preload
      config.plugin("preload").tap(() => [
        {
          rel: "preload",
          // to ignore runtime.js
          // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
          fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
          include: "initial"
        }
      ]);

      // when there are many pages, it will cause too many meaningless requests
      config.plugins.delete("prefetch");
    }
    config.plugin("html").tap(args => {
      args[0].title = title;
      args[0].keywords = "海速通,海速跨境平台,hst";
      args[0].description = title;
      // 生产环境注入cdn
      if (__PRO__) {
        args[0].cdn = cdn;
      }
      return args;
    });

    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
    config.when(__PRO__, config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  },
  configureWebpack: config => {
    config.name = title;
    if (__PRO__) {
      // 用cdn方式引入
      config.externals = {
        vue: "Vue",
        vuex: "Vuex",
        "vue-router": "VueRouter",
        axios: "axios",
        nprogress: "NProgress",
        ELEMENT: "Element",
        "nprogress.css": "nprogress.css",
        VueMeta: "VueMeta",
        dayjs: "dayjs"
      };
    }
  },
  devServer: {
    port: 9880,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      "/api": {
        target: VUE_APP_API,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
  }
};
