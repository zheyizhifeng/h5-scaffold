module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended",
    "eslint-config-prettier",
  ],
  plugins: ["html", "@typescript-eslint"],
  rules: {
    "no-console": process.env.VITE_NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.VITE_NODE_ENV === "production" ? "error" : "off",
    "vue/multi-word-component-names": "off",
  },
  globals: {
    globalThis: "readonly",
    NodeJS: "readonly",
    defineEmits: "readonly",
    defineProps: "readonly",
    APP_ENV: "readonly",
    APP_VERSION: "readonly",
    REPLACE_LOG_PVE_CUR: "readonly",
    REPLACE_LOG_EXTRAS: "readonly",
  },
};
