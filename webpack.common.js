'use strict';

const path = require('path'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    output: {
        filename: './assets/js/[name].bundle.js'
    },

    module: {
        rules: [
            // script-loader with 'env' preset
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            // html-loader
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            // sass-loader with sourceMap activated
            {
                test: /\.scss$/,
                include: /styles/,
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
            // css-loader with sourceMap activated
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            // file-loader(for images)
            { test: /\.(jpg|png|gif|svg)$/, use: [ { loader: 'file-loader', options: { name: '[name].[ext]', outputPath: './assets/img/' } } ] },
            // file-loader(for fonts)
            { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader'] },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                    // other vue-loader options go here
                }
            }
        ]
    },

    plugins: [
        // cleaning up only 'dist' folder
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: './assets/css/app.css'
        })
    ],

    resolve: {
        extensions: ['.js', '.vue'],
    }
};
