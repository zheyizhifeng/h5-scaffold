import request from "@/common/js/request";

export function getChapterInfo(params = {}) {
  return request.get(`/${params.book_id}/chapter_info.json`);
}
export function getChapterText(params = {}) {
  return request.get(`/${params.book_id}/${params.chapter_num}.txt`);
}

export function getBookDetail(params = {}) {
  return request.get(`/v2/novel/item/detail`, { params });
}

export function getBookRelated(params = {}) {
  return request.get(`/v2/novel/item/related`, { params });
}
