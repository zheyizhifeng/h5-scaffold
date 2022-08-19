import "@scss/common.scss";
import { store } from "@stores";
import { router } from "./routers";
import { i18n } from "@i18n";
import "normalize.css/normalize.css";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).use(store).use(router).use(i18n).mount("#app");
