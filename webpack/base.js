/*
 * @Descripttion: 
 * @Author: amplee
 * @Date: 2021-02-08 11:55:16
 * @LastEditors: amplee
 * @LastEditTime: 2021-02-22 19:19:35
 */
const webpack = require("webpack");
const path = require("path");
// const fs = require('fs');
// const webpackMerge = require('webpack-merge');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|mp3)$/i,
        // use: "file-loader"
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: 'assets/',
              limit: 8192,
            }
          },
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};
