const path = require("path")
const webpack = require('webpack')
const { CheckerPlugin } = require('awesome-typescript-loader')

function fromRoot(...paths) {
	return path.resolve(__dirname, ...paths)
}

module.exports = {
	mode: "development",
	entry: {
		curie: fromRoot("./src/Curie/index.ts"),
		server: fromRoot("./src/server.ts"),
	},
	output: {
		path: fromRoot("./dist"),
		filename: "[name].js",
		publicPath: fromRoot("./src/")
	},
	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: [fromRoot("src/")],
				exclude: [fromRoot("node_modules/")],
				loader: "awesome-typescript-loader"
			}
		]
	},
	// externals: {
	// 	react: "React",
	// 	"react-dom": "ReactDOM"
	// },
  plugins: [
		new CheckerPlugin()
  ]
}
