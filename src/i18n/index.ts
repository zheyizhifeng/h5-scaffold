import { getClientCountry } from "@js/utils";
import { createI18n } from "vue-i18n";
import EN from "./lang/EN";
import ID from "./lang/ID";
import MX from "./lang/MX";
import PH from "./lang/PH";
import ZH from "./lang/ZH";

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
