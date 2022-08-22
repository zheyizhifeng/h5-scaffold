import Loading from "@components/Loading.vue";
import { i18n } from "@i18n/index";
import { HYBRID_PORTAL } from "@js/constant";
import "@js/rem";
import { getUrlParam } from "@js/utils";
import { router } from "@routers/index";
import "@scss/common.scss";
import { store } from "@stores/index";
import "normalize.css/normalize.css";
import { log } from "shareit-hybird-js-sdk";
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App).use(store).use(router).use(i18n);
app.component("Loading", Loading);

app.config.globalProperties.$portal = getUrlParam("portal");
app.config.globalProperties.$hybridPortal = HYBRID_PORTAL;
app.config.globalProperties.$log = log;

app.mount("#app");
