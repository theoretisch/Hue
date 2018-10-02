const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  entry: {
    client: path.join(__dirname, './../client/src/index.js')
  },
  output: {
    path: path.join(__dirname, './../client/public'),
    publicPath: './'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({template: './client/src/index.html', xhtml: true, minify: {collapseWhitespace: true, conservativeCollapse: true, preserveLineBreaks: true}})
  ]
}
