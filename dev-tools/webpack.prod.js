const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({filename: 'css/bundle.min.css'});

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'js/bundle.min.js'
  },
  module: {
    rules: [
      {
        test: /\.(s)?css$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader'
            }, {
              loader: 'sass-loader'
            }
          ]
        })
      }, {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              'es2015', {
                loose: true
              }
            ],
            'react',
            'stage-2'
          ]
        }
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/image/',
              publicPath: '../image'
            }
          }
        ]
      }, {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/font/',
              publicPath: '../font'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    extractSass
  ]
});
