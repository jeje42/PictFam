var path = require('path');

module.exports = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  resolve: {
      extensions: [".ts", ".tsx", ".js"]
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
