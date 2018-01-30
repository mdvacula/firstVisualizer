var webpack = require('webpack');
var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/
      },
      {
        use: 'css-loader',
        test: /\.css$/
      },
      {
        use: 'file-loader',
        test: /\.mp3$/
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
