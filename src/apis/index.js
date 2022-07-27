import request from "@/common/js/request";

export function GetApi(params = {}) {
  return request.get("/xxx", {
    params: params,
  });
}

// post
export function PostApi(params = {}) {
  return request.post("/xxx", {
    ...params,
  });
}
