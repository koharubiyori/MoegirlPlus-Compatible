const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const config = require('../config')

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',

  devServer: {
    host: '0.0.0.0',
    port: config.devServerPort,
    client: {
      webSocketURL: `http://127.0.0.1:${config.devServerPort}/ws`,
      overlay: true, // 浏览器页面上显示错误
    },
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': config.source === 'moegirl' ? 
        'https://mzh.moegirl.org.cn' : 
        'https://m.hmoegirl.com',
      'Access-Control-Allow-Credentials': true,
    },
    static: {
      directory: path.resolve(__dirname, '../dist'),
      publicPath:'/',
    },
    // open: true, // 开启自动打开浏览器
    // stats: 'errors-only', //stats: 'errors-only'表示只打印错误：
    hot: true, // 开启热更新
  }
})