module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order",
    "stylelint-prettier/recommended",
    "stylelint-config-prettier",
  ],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["extend", "mixin", "include", "function", "return", "if", "else", "for", "each"],
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.{vue,html}"],
      customSyntax: "postcss-html",
    },
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
};
