var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    main: ['./src/utils.js', './src/table.js']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'weekly.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        }
      }
    ]
  },
  devtool: 'source-map'
}