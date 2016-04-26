'use strict';

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const prodPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      dead_code: true,
      drop_debugger: true,
      drop_console: true
    },
    comments: false
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin()
];

module.exports = {

  context: path.join(__dirname, 'src'),

  entry: [
    'webpack/hot/only-dev-server',
    './index.html',
    './main.js'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'gfw-assets.dev.js'
  },

  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.json$/, loader: 'json'},
      {test: /\.html$/, loader: 'file?name=[name].[ext]'},
      {test: /\.tpl$/, loader: 'ejs-loader'},
      {test: /\.scss$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader'},
      {test: /\.css$/, loader: 'style!raw'},
      {test: /\.(eot|ttf|woff2|woff)$/, loader: 'url-loader?prefix=fonts/&context=./src/fonts'}
    ]
  },

  plugins: process.env.NODE_ENV === 'production' ? prodPlugins : [],

  sassLoader: {
    includePaths: [path.join(__dirname, 'src', 'styles')]
  },

  postcss: function() {
    return [autoprefixer];
  }

};
