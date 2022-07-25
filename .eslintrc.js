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
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
  },
  globals: {
    globalThis: "readonly",
  },
};
