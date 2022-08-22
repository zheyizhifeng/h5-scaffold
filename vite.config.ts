import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import path from "path";
import pxtorem from "postcss-pxtorem";
import { defineConfig, loadEnv, UserConfig } from "vite";
import { viteExternalsPlugin } from "vite-plugin-externals";
import { createHtmlPlugin } from "vite-plugin-html";
import viteSentry from "vite-plugin-sentry";
import pkg from "./package.json";

const uploadSentrySourceMap = process.env.USE_SENTRY === "true"; //【Sentry】是否生成sourcemap

export default defineConfig(({ mode }: { mode: string }): UserConfig => {
  const env = loadEnv(mode, process.cwd()); // 加载 .env[.*] 配置文件
  /**
   * 离线包打点配置
   */
  const pkgType = process.env.PACKAGE_TYPE || "online"; // 页面类型online/offline/insert
  const pkgVersion = pkg.packageVersion || pkg.version; // 版本号（package.json中packageVersion或version）
  const pkgDate = new Date().toLocaleDateString(); // 上线日期
  const extras = `${pkgType}_${pkgVersion}_${pkgDate}`; // 离线包埋点extras参数

  /*
	sentry 配置
  */
  const sentryConfig = {
    url: "https://sentry.ushareit.org/",
    org: "shareit",
    project: "", // TODO: 项目名称
    authToken: "", // TODO: 项目token
    release: "version_" + pkgVersion, //每次发布修改的，设置sentry的release版本
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
        "@views": path.resolve(__dirname, "src/views"),
        "@components": path.resolve(__dirname, "src/components"),
        "@images": path.resolve(__dirname, "src/assets/images"),
        "@js": path.resolve(__dirname, "src/common/js"),
        "@scss": path.resolve(__dirname, "src/common/scss"),
        "@i18n": path.resolve(__dirname, "src/i18n"),
        "@apis": path.resolve(__dirname, "src/apis"),
        "@stores": path.resolve(__dirname, "src/stores"),
        "@routers": path.resolve(__dirname, "src/routers"),
        "@plugins": path.resolve(__dirname, "src/plugins"),
      },
    },
    server: {
      host: true,
      port: 8080,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      minify: true,
      sourcemap: uploadSentrySourceMap,
      manifest: true,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
    },
    esbuild: {
      drop: ["console", "debugger"],
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
      // 定义全局变量
      APP_ENV: JSON.stringify(env),
      APP_VERSION: JSON.stringify(pkgVersion),
      REPLACE_LOG_PVE_CUR: JSON.stringify(env.VITE_PVE_CUR),
      REPLACE_LOG_EXTRAS: JSON.stringify(extras),
    },
    plugins: [
      vue(),
      legacy(),
      createHtmlPlugin({
        minify: true,
        entry: "src/main.ts",
        inject: {
          data: {
            title: env.VITE_TITLE,
            REPLACE_LOG_PVE_CUR: env.VITE_PVE_CUR,
            REPLACE_LOG_EXTRAS: extras,
          },
        },
      }),
      viteExternalsPlugin({
        "shareit-hybird-js-sdk": "Hybird",
        "vue-intersection-plugin-revision": "vueIntersectionPlugin",
        // "lottie-web": "lottie",
        "@sentry/vue": "Sentry", //【Sentry】
        "@sentry/tracing": "Integrations", // 【Sentry】
      }),
    ],
  };
  if (uploadSentrySourceMap) {
    commonConfig.plugins.push(viteSentry(sentryConfig));
  }
  return commonConfig as any;
});
