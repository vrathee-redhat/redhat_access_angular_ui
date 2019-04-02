const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  entry: './app/server.js',
  output: {
    path: __dirname + '/dist',
    filename: 'server.js'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals()],
  plugins: [new UglifyJsPlugin()]
};
