var path = require('path');

module.exports = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  resolve: {
      extensions: [".ts", ".tsx", ".js"]
  },
  output: {
      path: __dirname,
      filename: '../target/classes/static/built/bundle.js'
  },
	module: {
		rules: [
      {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: 'ts-loader'
      }
		]
	}
};
