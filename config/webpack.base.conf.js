const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpackRules = require('./webpack.rules')

const devMode = process.env.NODE_ENV === 'development'

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src/main.ts'),
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist')
  },

  module: {
    rules: webpackRules
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../src')
    },
    extensions: ['.ts', '.js', '.json'] // 如果引入时没带后缀名，则会依次尝试这里定义的后缀名
  },

  plugins: [    
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].css',
      chunkFilename: devMode ? '[id].css' : '[id].css',
    }),

    // 拷贝目录
    // new CopyWebpackPlugin({
    //   patterns: [{
    //     from: path.resolve(__dirname, '../src/static'),
    //     to: path.resolve(__dirname, '../dist/static')
    //   }]
    // })
  ],
}