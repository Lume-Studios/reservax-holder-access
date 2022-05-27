const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack')

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        hot: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers':
                'X-Requested-With, content-type, Authorization'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                CHAIN_ID: JSON.stringify('0x4'),
                CONTRACT_ADDRESS: JSON.stringify('0xb6601B239c53820558643009c6E9784C5e757d27'),
                PROJECT_ID: JSON.stringify('62055cd53fb9db48300256a1'),
                SERVER: JSON.stringify('http://localhost:3001/'),
                AUTHENTICATION: JSON.stringify('0xA65aae78EdEF916d4102BA7b5672068C0D35fbff')
            }
        })
    ]
});