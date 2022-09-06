const path = require('path');

module.exports = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src'),
      '@view': path.resolve(__dirname, 'src/view'),
      '@component': path.resolve(__dirname, 'src/component'),
      '@image': path.resolve(__dirname, 'src/assets/image'),
      '@js': path.resolve(__dirname, 'src/common/js'),
      '@scss': path.resolve(__dirname, 'src/common/scss'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@router': path.resolve(__dirname, 'src/router'),
      '@plugin': path.resolve(__dirname, 'src/plugin'),
    },
  },
};
