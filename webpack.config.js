const path = require('path');
module.exports = {
  entry: './src/app.js',
  mode: 'develop',
  devtool: 'cheap-source-map',
  externals: {
    "xlsx": {
      commonjs: "xlsx",//如果我们的库运行在Node.js环境中，import _ from 'lodash'等价于const _ = require('lodash')
      commonjs2: "xlsx",//同上
      amd: "xlsx",//如果我们的库使用require.js等加载,等价于 define(["lodash"], factory);
      root: "xlsx"//如果我们的库在浏览器中使用，需要提供一个全局的变量‘_’，等价于 var _ = (window._) or (_);
    },
    "line-reader": {
      commonjs: "line-reader",
      commonjs2: "line-reader",
      amd: "line-reader",
      root: "line-reader"
    }
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'i18ntranslator.min.js',
    libraryTarget: 'umd'
  }
};