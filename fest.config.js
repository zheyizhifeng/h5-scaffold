const pkg = require("./package.json");
const env = process.env.ENV;
const center = env ? "-" + env : "";
const date = new Date().toLocaleDateString();

module.exports = {
  pack: [
    {
      source: "./dist",
      out: `./packed/${env || "prod"}_Fiction_Offline_${pkg.version}.zip`, // TODO: 打包的离线包路径名称, eg: prod_Fiction_Offline_0.0.1.zip
      prefixUrl: `https://active${center}.wshareit.com/client/mvp-fiction`, // TODO: prefixUrl, eg: https://active.wshareit.com/client/mvp-fiction
      showLog: true,
      headComments: `${env || "prod"} offline package version ${pkg.version} on ${date}`,
      // blackList: ["url"],
    },
  ],
};
