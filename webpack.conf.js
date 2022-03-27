const path = require('path');
module.exports = {
  entry: './src/index.ts',
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      { 
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ],
        exclude: /node_modules/
      },
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts'],
  },
};