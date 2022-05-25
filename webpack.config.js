const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	mode: "production",
	entry: "./src/entry.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "yamd.min.js",
		library: "yamd",
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
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					keep_fnames: true
				}
			})
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.__webpack__': true
		})
	],
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
