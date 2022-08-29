import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./lang/en.js";
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: en,
  },
});

const loadedLanguages = ["en"];
const supportLanguages = ["en"];
const supportCountrys = ["US"];

Vue.prototype.$supportCountrys = supportCountrys;
i18n.supportCountrys = supportCountrys;

i18n.loadLanguageAsync = (lang) => {
  if (!lang || lang === i18n.locale || !supportLanguages.includes(lang)) {
    return;
  }

  if (loadedLanguages.includes(lang)) {
    i18n.locale = lang;
  } else {
    import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}`).then(
      (msgs) => {
        // console.log("lang :>> ", lang);
        // console.log("msgs :>> ", msgs);
        i18n.setLocaleMessage(lang, msgs.default);
        loadedLanguages.push(lang);
        i18n.locale = lang;
      }
    );
  }
};

export default i18n;
