/**
 * Created by ZHAOBILONG846 on 2016/12/27.
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: false,
    historyApiFallback: true
}).listen(5000, '127.0.0.1', function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:5000');
    });