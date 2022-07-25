import { log } from "shareit-hybird-js-sdk";
import Vue from "vue";
import vueIntersectionPlugin from "vue-intersection-plugin-revision";
import { getUrlParam } from "../common/js/utils";
const buryPointSet = new Set();

Vue.use(vueIntersectionPlugin, {
  handler: (logData) => {
    if (logData.type === "show_ve_book") {
      const { novel_id } = logData.body;
      if (!buryPointSet.has(novel_id)) {
        buryPointSet.add(novel_id);
        log({
          params: {
            eventId: "show_ve",
            pve_cur: "/novel/landing/x",
            items: JSON.stringify({
              item_id: logData.body.novel_id,
            }),
            type: "0",
            portal: getUrlParam("portal"),
          },
        });
      }
    } else if (logData.type === "show_content") {
      log({
        params: {
          eventId: "show_content",
          pve_cur: "/novel/detail/recommend",
          items: JSON.stringify({
            item_id: logData.params.item_id,
            category_id: logData.params.category_id,
          }),
          type: "0",
        },
      });
    }
  },
});
