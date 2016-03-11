module.exports = {
  entry: './src/index.js',
  output: {
    path: './build',
    publicPath: '/build/',
    filename: 'build.js'
  },
  devtool: "eval-source-map",
  module: {
    preLoaders: [
      { test: /\.vue$/, loader: 'eslint', exclude: /node_modules/ },
    ],
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.js$/, loader: 'babel!eslint', exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json' }
    ]
  }
};