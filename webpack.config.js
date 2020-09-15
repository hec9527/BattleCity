const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const resolve = (dir) => path.resolve(__dirname, './Typescript/', dir);

module.exports = {
  mode: 'development',

  entry: resolve('src/index.ts'),

  output: {
    path: resolve('dist'),
    filename: 'js/[id].[hash:8].js',
    publicPath: '/',
  },

  resolve: {
    // 如果写 则必须包含'.js' 否则会找不到部分库文件
    extensions: ['.ts', '.js'],
    alias: {
      '@/*': resolve('src/*'),
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|mp3|ttf)$/,
        use: {
          loader: 'url-loader',
          options: { limit: 10240 }, // 超过10k使用外链，否则使用base64编码
        },
      },
    ],
  },

  devServer: {
    contentBase: resolve('dist'),
    host: 'localhost',
    port: 10086,
    hot: true,
    compress: false,
    // quiet: true,
    // noInfo: true,
    stats: {
      modules: false,
      debug: false,
      colors: true,
    },
    overlay: true,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedChunksPlugin(),
    new HTMLWebpackPlugin({
      title: 'Battle City',
      filename: 'index.html',
      template: './Typescript/index.html',
    }),
  ],
};