import {
  requestParams,
  // loginInfo,
  locationInfo,
} from "shareit-hybird-js-sdk";
import { getUUID } from "./utils";
const activityCode = "shareit_daily_";
const getCommonParams = () => {
  // 获取国家 LBS > 系统国家
  // const loginData = loginInfo();
  const location = locationInfo() || {};
  const country = location.lCountryCode || location.sCountryCode || "";
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
    try {
      const data = JSON.parse(requestParamsData.requestParams);
      commonParams = data;
    } catch (e) {
      console.log("e :>> ", e);
    }
  }

  commonParams.country = country;
  commonParams.trace_id = trace_id;
  commonParams.activity_code = activityCode + country; //临时活动码
  return commonParams;
};

export default getCommonParams;
