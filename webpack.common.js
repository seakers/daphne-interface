'use strict';

const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');


module.exports = {
    entry: {
        index: './src/index.js',
        details: './src/details.js',
        vassar: './src/vassar.js',
        adds: './src/adds.js'
    },

    output: {
        filename: './assets/js/[name].bundle.js'
    },

    module: {
        rules: [
            // script-loader with 'env' preset
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            },
            // html-loader
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            // sass-loader with sourceMap activated
            {
                test: /\.(s[ac]ss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            // file-loader(for images)
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/img/[name][ext][query]'
                }
            },
            // file-loader(for fonts)
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/inline',
            },
        ]
    },

    plugins: [
        // cleaning up only 'dist' folder
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['index'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/details.html',
            chunks: ['details'],
            filename: 'details.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/vassar.html',
            chunks: ['vassar'],
            filename: 'vassar.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/adds.html',
            chunks: ['adds'],
            filename: 'adds.html'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: './assets/css/[name].css'
        }),
        new VueLoaderPlugin()
    ],

    resolve: {
        extensions: ['.js', '.vue'],
    }
};
