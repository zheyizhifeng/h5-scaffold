import request from "@/common/js/request";
// get
export function GetApi(params = {}, clientConfig = {}) {
  return request.get("/xxx", { params, clientConfig });
}

// post
export function PostApi(params = {}, clientConfig = {}) {
  return request.post("/xxx", { ...params }, { clientConfig });
}
