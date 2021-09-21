const path = require('path')
const webpack = require('webpack')

module.exports = {
	resolve: {
	extensions: ['.js', '.json', '.vue'],
		alias: {
			"_assets": path.resolve(__dirname, "./src/assets"),
			"_components": path.resolve(__dirname, "./src/components"),
			"_atoms": path.resolve(__dirname, "./src/components/atoms"),
			"_molecules": path.resolve(__dirname, "./src/components/molecules"),
			"_organisms": path.resolve(__dirname, "./src/components/organisms"),
			"_navigations": path.resolve(__dirname, "./src/navigations"),
			"_scenes": path.resolve(__dirname, "./src/scenes"),
			"_services": path.resolve(__dirname, "./src/services"),
			"_styles": path.resolve(__dirname, "./src/styles"),
			"_utils": path.resolve(__dirname, "./src/utils"),
			"_stores": path.resolve(__dirname, "./src/stores"),
		}
	}
}


