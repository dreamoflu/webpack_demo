const path = require('path');
const glob = require("glob")
const PurifyCSSPlugin = require("purifycss-webpack"); //消除无用css
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const express = require('express')
const proxyTable = require('http-proxy-middleware');
const uglify = require('uglifyjs-webpack-plugin')
var app = express();
const buildPath = path.resolve(__dirname, 'dist');
const ExtractTextWbpackPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
	
const copyWebpackPlugin= require("copy-webpack-plugin");


let ROOT_path
console.log( encodeURIComponent(process.env.type) );
if(process.env.type=='dev'){
    ROOT_path="http://localhost:8080/"
}else{
    ROOT_path="http://www.baidu.com/"
}



module.exports = {
    devtool: 'eval-source-map',
    entry: {
        entry: "./src/js/entry.js",
        entry2: "./src/js/entry2.js",
        jquery:'jquery'
    },
    output: {
        path: buildPath,
        filename: 'static/js/[name].[hash].js',
        chunkFilename: "[id].js",
        publicPath: ROOT_path
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',

            },
            //     {
            //     test: /\.css$/,
            //      use: ["style-loader","css-loader"] 
            // },
            {
                test: /\.css$/,
                use: ExtractTextWbpackPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: "css-loader",
                            options: {
                                importLoaders: 1
                            }
                        }, {
                            loader: "postcss-loader"
                        }

                    ]
                })
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        outputPath: 'static/images/',
                    }
                }]
            }, {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },

            // {
            //     test: /\.less$/,
            //     use: ['style-loader','css-loader','less-loader',]
            //     } ,
            {
                test: /\.less$/,
                use: ExtractTextWbpackPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            // {
            //     test:/\.(jsx|js)$/,
            //     use:{
            //         loader:'babel-loader',
            //         options:{
            //             presets:[
            //                 "es2015","react"
            //             ]
            //         }
            //     },
            //     exclude:/node_modules/
            // }


            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: /node_modules/
            }
        ]
    },



    plugins: [
        	
new webpack.HotModuleReplacementPlugin(),
        new copyWebpackPlugin([{
            from:__dirname+'/src/public',
            to:'./static/public'
        }]),
    
        new webpack.optimize.CommonsChunkPlugin({
            //name对应入口文件中的名字，我们起的是jQuery
            name:'jquery',
            //把文件打包到哪里，是一个路径
            filename:"static/js/jquery.min.js",
            //最小打包的文件模块数，这里直接写2就好
            minChunks:2
        }),
        new OpenBrowserPlugin(),
        new ExtractTextWbpackPlugin("static/css/[name].[hash].css"),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, '*.html')),
        }),
        // new uglify(),
        new HtmlWebpackPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            template: 'index.html',

        }),
        new CleanWebpackPlugin(
            ['dist/*'], {
                //"root":"[webpack.config的地址]",//一个根的绝对路径.
                "verbose": true, //将log写到 console.
                //"dry": false,// 不要删除任何东西，主要用于测试.
                //"exclude": ["files","to","ignore"]//排除不删除的目录，主要用于避免删除公用的文件
            }
        ),
        new webpack.ProvidePlugin({
            axios: "axios",
            $: "jquery"
        })
    ],
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 8080,


    },


    watchOptions: {
        //检测修改的时间，以毫秒为单位
        poll: 1000,
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregeateTimeout: 5000,
        //不监听的目录
        ignored: /node_modules/,
    }


}