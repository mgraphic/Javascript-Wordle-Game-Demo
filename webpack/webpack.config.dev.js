const ESLintPlugin = require('eslint-webpack-plugin');
const Path = require('path');
const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
        chunkFilename: 'js/[name].chunk.js',
    },
    devServer: {
        hot: true,
    },
    plugins: [
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new ESLintPlugin({ emitWarning: true }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.js$/,
                include: Path.resolve(__dirname, '../src'),
                loader: 'babel-loader',
            },
            {
                test: /\.s?css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
});
