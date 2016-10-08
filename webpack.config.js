const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src'
  ],
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
   loaders: [{
     test: /\.jsx?$/,
     exclude: /node_modules/,
     loaders: ['babel?cacheDirectory']
   }]
 },
 resolve: {
   root: __dirname,
    alias: {

    },
    modulesDirectories: [
        'node_modules',
        './src/components'
    ],
    extensions: ['','.js','.jsx']
 },
  devServer: {
    host: HOST,
    port: PORT,
    hot: true,
    contentBase: './dist'
  }
};
