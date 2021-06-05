/* eslint-disable @typescript-eslint/no-var-requires */
const HTMLWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const resolve = str => path.resolve(__dirname, str);

/** @type {import("@types/webpack").Configuration} */
const config = {
  mode: 'development',

  entry: resolve('/src/index.ts'),

  output: {
    path: resolve('./build'),
    filename: 'js/[name].js',
  },

  devtool: false,

  resolve: {
    alias: {
      '@': resolve('./src/'),
    },
    extensions: ['.ts', '.d.ts'],
  },

  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        // type: 'asset/resource',
      },
      {
        test: /\.(png|jpg|mp3|ttf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240, // 超过10k使用外链，否则使用base64编码
            name: '/static/[name].[ext]',
            fallback: require.resolve('file-loader'),
          },
        },
      },
    ],
  },

  plugins: [
    // new CleanWebpackPlugin({
    //   cleanAfterEveryBuildPatterns: [resolve('./build/')],
    // }),
    new HTMLWebpackPlugin({
      title: 'Battle City',
      filename: 'index.html',
      template: resolve('/public/index.html'),
    }),

    // 自定义source-map
    // new webpack.EvalSourceMapDevToolPlugin({
    //   columns: false,
    //   module: true,
    //   exclude: [/node_modules/, /dist/, /build/],
    //   include: /src/,
    // }),
  ],
};

module.exports = config;
