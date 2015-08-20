module.exports = {
  entry: './js/app.js',
  output: {
    filename: './js/bundle.js'
  },
  module: {
    loaders:[
      { test: /\.js[x]?$/, exclude: /node_modules/, loaders: ['babel-loader'] },
    ]
  }
};
