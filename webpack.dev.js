const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    watchFiles: ['src/template.html'],
    port: 8081,
    client: {
      overlay: {
        warnings: true,
        errors: true
      }
    },
  },
});