import Vue from "vue";
import VueI18n from "vue-i18n";
import { getClientCountry } from "../common/js/utils";
import EN from "./lang/EN.js";
import ID from "./lang/ID.js";
import MX from "./lang/MX.js";
import PH from "./lang/PH.js";
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: getClientCountry(),
  fallbackLocale: "EN",
  messages: {
    EN: EN,
    ID: ID,
    MX: MX,
    PH: PH,
  },
});

export default i18n;
