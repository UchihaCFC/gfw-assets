'use strict';

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var path = require('path');
var version = process.env.VERSION || 'latest';
var S3Plugin = require('webpack-s3-plugin');

var prodPlugins = [
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
  new webpack.optimize.OccurrenceOrderPlugin(),
  new S3Plugin({
    directory: 'dist',
    exclude: /.*\.html$/,
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1'
    },
    s3UploadOptions: {
      Bucket: 'gfw-assets/static'
    }
  })
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
    filename: 'gfw-assets.' + version + '.js'
  },

  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.json$/, loader: 'json'},
      {test: /\.html$/, loader: 'file?name=[name].[ext]'},
      {test: /\.tpl$/, loader: 'ejs-loader'},
      {test: /\.scss$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader'},
      {test: /\.css$/, loader: 'style!raw'}
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
