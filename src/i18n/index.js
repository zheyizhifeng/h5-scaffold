import { getClientCountry } from "@js/utils";
import { createI18n } from "vue-i18n";
import EN from "./lang/EN.js";
import ID from "./lang/ID.js";
import MX from "./lang/MX.js";
import PH from "./lang/PH.js";
import ZH from "./lang/ZH.js";

const locale = getClientCountry();
export const i18n = createI18n({
  locale,
  fallbackLocale: "EN",
  messages: {
    EN: EN,
    ID: ID,
    MX: MX,
    PH: PH,
    ZH: ZH,
  },
});
