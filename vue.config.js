const isPro = process.env.NODE_ENV === "production" ? true : false;
// const SentryWebpackPlugin = require("@sentry/webpack-plugin"); //【Sentry】
const uploadSentrySourceMap = process.env.USE_SENTRY === "true"; //【Sentry】build是否生成sourcemap,当使用npm run build:sentry时开启，上传soucemap到sentry
const ReplaceStringWebpackPlugin = require("@shareit/replace-string-webpack-plugin");
const packagejson = require("./package.json");
const pxtorem = require("postcss-pxtorem");
// 自动生成雪碧图
const path = require("path");
const spriteTemplate = require("./src/common/js/spriteTemplate");
const SpritesmithPlugin = require("webpack-spritesmith");

const pve_cur = "/fe-ActiveXXX/0"; // TODO: 需要替换-离线包埋点事件名

module.exports = {
  publicPath: "./",
  productionSourceMap: uploadSentrySourceMap,
  transpileDependencies: ["vconsole"],
  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
  configureWebpack: (config) => {
    if (isPro) {
      // 【Sentry】上传sourcemap
      // config.plugins.push(
      //   new SentryWebpackPlugin({
      //     url: "https://sentry.ushareit.org/",
      //     org: "shareit",
      //     project: "likeit-lite-task", // TODO: 需要替换-sentry项目名
      //     authToken:
      //       "cb565dfc37a34da2ad6c98f221d1e9df1683f9d99718455a845be550f2cdf403",
      //     release: "version_" + packagejson.packageVersion, //每次发布修改的，设置sentry的release版本
      //     dryRun: !uploadSentrySourceMap, // 在测试、开发环境为true，空运行。 当发布时候为false。
      //     include: "./dist",
      //     ignore: ["node_modules", "vue.config.js", "babel.config.js", "src"],
      //     urlPrefix: "~/", //cdn js的代码路径前缀，主要是用来映射sourceMap
      //     deploy: {
      //       env: process.env.VUE_APP_ENVIRONMENT,
      //     },
      //   })
      // );

      // 添加离线包打点相关环境变量
      const PackageType = process.env.PACKAGE_TYPE || "online"; // 页面类型online/offline/insert
      const PackageVersion = packagejson.packageVersion; // 版本号（package.json中packageVersion）
      let date = new Date();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      const PackageBuildDate = String(month) + day; // 上线日期

      let extras = `${PackageType}_${PackageVersion}_${PackageBuildDate}`; // 离线包埋点extras参数
      config.plugins.push(
        new ReplaceStringWebpackPlugin({
          REPLACE_LOG_PVE_CUR: pve_cur, //   eg:前段/中段/后段
          REPLACE_LOG_EXTRAS: extras,
        })
      );
    }

    if (isPro && process.env.VUE_APP_ENVIRONMENT === "prod") {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs =
        ["console.log"];
    }

    // 雪碧图
    config.plugins.push(
      new SpritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, "./src/assets/images/spriteIcons"), //改目录下存放需要转为雪碧图的图片
          glob: "*.png",
        },
        target: {
          image: path.resolve(__dirname, "./src/assets/images/sprite.png"), //自动生成的雪碧图 的存放位置
          css: [
            [
              path.resolve(__dirname, "./src/common/scss/sprite.scss"), //自动生成的雪碧图样式文件存放位置
              {
                format: "function_based_template", //自定义模板名称，与customTemplates中key对应
              },
            ],
          ],
        },
        apiOptions: {
          cssImageRef: "../../assets/images/sprite.png", //上述自动生成的sprite.scss文件 中引入sprite.png的相对路径
        },
        customTemplates: {
          function_based_template: spriteTemplate, //自定义雪碧图样式文件模板，模板返回值将填充到雪碧图样式文件中
        },
        spritesmithOptions: {
          algorithm: "binary-tree",
          padding: 2, //雪碧图中小图标之间的间距,根据需要进行配置
        },
      })
    );

    config.externals = {
      vue: "Vue",
      axios: "axios",
      "shareit-hybird-js-sdk": "Hybird",
      // vuex: "Vuex",
      // "vue-router": "VueRouter",
      // "vue-intersection-plugin-revision": "vueIntersectionPlugin",
      "vue-i18n": "VueI18n",
      // "@sentry/vue": "Sentry", //【Sentry】
      // "@sentry/tracing": "Integrations", // 【Sentry】
    };
  },

  // chainWebpack: (config) => {
  // 【Sentry】添加版本环境变量 sentry使用
  // config.plugin("define").tap((args) => {
  //   args[0]["process.env"].VUE_APP_PACKAGE_VERSION = JSON.stringify(
  //     packagejson.packageVersion
  //   );
  //   return args;
  // });
  // },

  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          pxtorem({
            rootValue: 36, // 2倍图(720px)
            unitPrecision: 5,
            propList: ["*"],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
            exclude: /node_modules/i,
          }),
          require("autoprefixer"), // 配置pxtorem后默认配置会被覆盖，所以需要重新引入autoprefixer
        ],
      },
      scss: {
        prependData: `
          @use "@/common/scss/mixin.scss" as *;
        `,
      },
    },
  },
};
