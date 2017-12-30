/**
 * Created by 01.26.
 */
var webpack = require('webpack');
var path = require('path');
//var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    //页面入口文件配置
    entry: {
        bundle: [
            //'webpack-dev-server/client?http://localhost:5000',
            //'webpack/hot/only-dev-server',
            './js/js/index.js'
        ],
        common: ['react', 'react-dom']
    },
    //入口文件输出配置
    output: {
        path: __dirname + '/assets/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath:  './assets/'
    },
    module: {
        //加载器配置
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.js$/,
                loader: 'jsx-loader?harmony'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=[path][name].[ext]'
            },
            {
                test: /\.js|jsx$/,
                loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=react,presets[]=stage-0'],
                include: path.join(__dirname, 'js')
            }
        ]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['', '.js', '.json', '.scss']

    },
    //插件项
    plugins: [
        //new webpack.HotModuleReplacementPlugin(),//热插拔
        new webpack.NoErrorsPlugin(),
         new webpack.optimize.UglifyJsPlugin({//压缩
             output: {
                 comments: false  // remove all comments
             },
             compress: {
                 warnings: false
             }
         }),
        new webpack.optimize.CommonsChunkPlugin({//打包第三方库
            names: ['common'],
        })
        //new ExtractTextPlugin('./css/[name].min.css')

    ]
};