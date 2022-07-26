import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue2";
import autoprefixer from "autoprefixer";
import path from "path";
import pxtorem from "postcss-pxtorem";
import { defineConfig, loadEnv } from "vite";
import { viteExternalsPlugin } from "vite-plugin-externals";
import { replaceCodePlugin } from "vite-plugin-replace";
import viteSentry from "vite-plugin-sentry";
import pkg from "./package.json";
const uploadSentrySourceMap = process.env.USE_SENTRY === "true"; //【Sentry】是否生成sourcemap

export default defineConfig(({ command, mode }) => {
  // eg. command: 'serve', mode: 'development'
  const env = loadEnv(mode, process.cwd()); // 加载配置文件
  /**
   * 添加离线包打点相关环境变量
   */
  const pve_cur = "/shareit-mvp-fiction/0"; // !!!!!!!!!!!!修改离线包埋点事件名!!!!!!!!!!!!
  const pkgType = process.env.PACKAGE_TYPE || "online"; // 页面类型online/offline/insert
  const pkgVersion = pkg.packageVersion || pkg.version; // 版本号（package.json中packageVersion或version）
  const pkgDate = new Date().toLocaleDateString(); // 上线日期
  const extras = `${pkgType}_${pkgVersion}_${pkgDate}`; // 离线包埋点extras参数
  /*
	Configure sentry plugin
  */
  const sentryConfig = {
    url: "https://sentry.ushareit.org/",
    org: "shareit",
    project: "", // 项目名称
    authToken: "", // 项目token
    release: "version_" + (pkg.packageVersion || pkg.version), //每次发布修改的，设置sentry的release版本
    deploy: {
      env: env.VITE_ENVIRONMENT, // 环境变量
    },
    dryRun: !uploadSentrySourceMap, // 在测试、开发环境为true，空运行。 当发布时候为false。
    setCommits: {
      auto: true, // 自动获取commit信息
    },
    sourceMaps: {
      include: ["./dist/"],
      ignore: ["node_modules", "vite.config.js", "babel.config.js", "src"],
      urlPrefix: "~/",
    },
  };
  /**
   * 基础vite 配置
   */
  const commonConfig = {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    base: "/",
    server: {
      // host: true,
      port: 8080,
      // open: true,
      proxy: {
        "/api": {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          pathRewrite: {
            "^/api": "/",
          },
        },
      },
    },
    build: {
      sourcemap: uploadSentrySourceMap,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "src/common/scss/mixin.scss";',
        },
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 36,
            unitPrecision: 5,
            propList: ["*"],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
            exclude: /node_modules/i,
          }),
        ],
      },
    },
    define: {
      // __APP_ENV__: env.APP_ENV,
    },
    plugins: [
      vue(),
      legacy(),
      replaceCodePlugin({
        replacements: [
          {
            from: /REPLACE_LOG_PVE_CUR/g,
            to: pve_cur,
          },
          {
            from: /REPLACE_LOG_EXTRAS/g,
            to: extras,
          },
        ],
      }),
      viteExternalsPlugin({
        vue: "Vue",
        axios: "axios",
        "shareit-hybird-js-sdk": "Hybird",
        vuex: "Vuex",
        "vue-router": "VueRouter",
        "vue-intersection-plugin-revision": "vueIntersectionPlugin",
        "vue-i18n": "VueI18n",
        "lottie-web": "lottie",
        // "@sentry/vue": "Sentry", //【Sentry】
        // "@sentry/tracing": "Integrations", // 【Sentry】
      }),
    ],
  };
  if (uploadSentrySourceMap) {
    commonConfig.plugins.push(viteSentry(sentryConfig));
  }
  if (command === "serve") {
    return {
      ...commonConfig,
      // dev 独有配置
    };
  } else {
    // command === 'build'
    return {
      ...commonConfig,
      // build 独有配置
    };
  }
});
