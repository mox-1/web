var webpack = require('webpack');
module.exports = {
  debug: true,
  devtool: 'inline-source-map',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map'
  },
  plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015' ]
      }
    },
    { test: /\.jpg$/, loader: "url-loader?limit=100000" },
    { test: /\.png$/, loader: "url-loader?limit=100000" },
    {
      test: /\.scss$/,
      loader: 'style!css!sass!'
    }
    ]
  }
};
