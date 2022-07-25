import vue from "@vitejs/plugin-vue2";
import autoprefixer from "autoprefixer";
import path from "path";
import pxtorem from "postcss-pxtorem";
import { defineConfig, loadEnv } from "vite";
import { viteExternalsPlugin } from "vite-plugin-externals";

export default defineConfig(({ command, mode }) => {
  // command: 'serve', mode: 'development'
  const env = loadEnv(mode, process.cwd());
  console.log(">>>>>>> env", env);
  const commonConfig = {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    base: "/",
    // envPrefix: 'VUE_APP_',
    server: {
      host: true,
      port: 8080,
      open: true,
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "/",
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "src/common/scss/mixin.scss";',
        },
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ["last 2 versions", "Firefox ESR", "> 1%", "ie >= 8", "iOS >= 8", "Android >= 4"],
          }),
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
