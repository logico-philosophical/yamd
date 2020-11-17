const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: "production",
	entry: "./src/entry.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "m42kup.min.js",
		library: "m42kup",
		libraryTarget: 'umd',
		globalObject: 'typeof self !== \'undefined\' ? self : this'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	devtool: 'source-map',
	stats: {
		cached: false,
		cachedAssets: false,
		chunks: false,
		chunkModules: false,
		chunkOrigins: false,
		modules: false
	}
};
