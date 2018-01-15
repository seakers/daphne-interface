'use strict';

const path = require('path'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({ filename: './assets/css/app.css' });

module.exports = {
    context: path.resolve(__dirname, "src"),

    entry: {
        app: ['./app.js', './styles/app.scss']
    },

    output: {
        filename: './assets/js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    module: {
        rules: [
            // script-loader with 'env' preset
            { test: /\.js$/, include: /src/, exclude: /node_modules/, use: { loader: "script-loader" } },
            // html-loader
            { test: /\.html$/, use: ['html-loader'] },
            // sass-loader with sourceMap activated
            {
                test: /\.scss$/,
                include: /styles/,
                use: extractPlugin.extract({
                    use: [
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
                    ],
                    fallback: 'style-loader'
                })
            },
            // file-loader(for images)
            { test: /\.(jpg|png|gif|svg)$/, use: [ { loader: 'file-loader', options: { name: '[name].[ext]', outputPath: './assets/img/' } } ] },
            // file-loader(for fonts)
            { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader'] }
        ]
    },

    plugins: [
        // cleaning up only 'dist' folder
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        // extract-text-webpack-plugin instance
        extractPlugin
    ],

    devtool: 'inline-source-map',
};
