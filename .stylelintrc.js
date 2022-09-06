module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-prettier/recommended',
    'stylelint-config-prettier',
  ],
  rules: {
    'at-rule-no-unknown': null, // @include @mixin等不需要检查
    'font-family-no-missing-generic-family-keyword': null, // 主字体缺失不需要检查
    'value-no-vendor-prefix': null, // 如-webkit-box属性不需要检查
  },
  overrides: [
    {
      files: ['**/*.html'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
};
