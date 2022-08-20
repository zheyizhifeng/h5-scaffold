import { loginInfo, requestParams } from "shareit-hybird-js-sdk";
import { getUUID } from "./utils";
const getCommonParams = () => {
  // 获取国家（默认印尼）
  const loginData = loginInfo();
  const country =
    (loginData === null || loginData === void 0 ? void 0 : loginData.user_country) ||
    (loginData === null || loginData === void 0 ? void 0 : loginData.countryCode) ||
    "ID";
  // 获取trace_id
  const trace_id = getUUID();
  let commonParams = {};
  // sign参数中添加country
  const requestParamsData = requestParams({
    params: {
      country: country,
    },
  });
  if (requestParamsData && requestParamsData.responseCode === "0") {
    const data = JSON.parse(requestParamsData.requestParams);
    commonParams = data;
  }
  commonParams.country = country;
  commonParams.trace_id = trace_id;
  return commonParams;
};
export default getCommonParams;
