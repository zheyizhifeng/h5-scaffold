module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
    amd: true,
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "plugin:prettier/recommended", "eslint-config-prettier"],
  plugins: ["html"],
  rules: {
    "no-console": process.env.VITE_NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.VITE_NODE_ENV === "production" ? "error" : "off",
    "vue/multi-word-component-names": "off",
  },
  globals: {
    globalThis: "readonly",
    APP_ENV: "readonly",
    APP_VERSION: "readonly",
    REPLACE_LOG_PVE_CUR: "readonly",
    REPLACE_LOG_EXTRAS: "readonly",
  },
};
