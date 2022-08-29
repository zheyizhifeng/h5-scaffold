const packagejson = require("./package.json");
const v = packagejson.packageVersion || "1";
module.exports = {
  pack: [
    {
      source: "./offline",
      out: `./packed/ShareitActiveOffline_${v}.zip`,
      prefixUrl: "https://active.wshareit.com/xxx", // TODO: 需要替换-离线包打包url
      showLog: true,
      blackList: [
        // "https://active.wshareit.com/xxx/index.html"
      ], // 离线包打包黑名单，配置内容将不会打入离线包，如果不希望html被缓存可将其加入
    },
  ],
};
