module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                'cwd': 'babelrc',
                'root': ['./src'],
                'extensions': ['.js', '.ios.js', '.android.js'],
                'alias': {
                    '_assets': './src/assets',
                    '_components': './src/components',
                    '_atoms': './src/components/atoms',
                    '_molecules': './src/components/molecules',
                    '_organisms': './src/components/organisms',
                    '_navigations': './src/navigations',
                    '_scenes': './src/scenes',
                    '_services': './src/services',
                    '_stores': './src/stores',
                    '_styles': './src/styles',
                    '_utils': './src/utils',
                    '_base': './src'
                }
            }
        ],
    ],
};
