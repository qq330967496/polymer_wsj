var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var config = {
    cache: true,
    //页面入口文件配置
    entry:getEntry(),
    //入口文件输出配置
    output: {
        path: path.join(__dirname, '/webapp/wechat'),
        publicPath: "webapp/wechat/js/",
        filename: '[name].js'
    },
    //其它解决方案配置
    resolve: {
        alias: {
            //插件名称
            // zepto:__dirname+'/wechat_src/lib/zepto/zepto.min.js',
            // tap:__dirname+'/wechat_src/lib/zepto/zepto.tap.min.js',
            // iscroll:__dirname+'/wechat_src/lib/iscroll/iscroll.min.js',
            // swiper:__dirname+'/wechat_src/lib/swiper.min.js',
            //工具模块
            utils:__dirname+'/wechat_src/lib/utils.js',
            //web-storage-cache模块
            // wsCache:__dirname+'/wechat_src/lib/web-storage-cache.min.js',
            // vue: 'vue/dist/vue',
            //vue组件
            // components: __dirname+'/wechat_src/components'
        }
    },
    module: {
        loaders: [
            { test: /\.vue$/, loader: 'vue'  },
            { test: /\.js$/,  loader: 'babel', exclude: /node_modules/},
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader") },
            { test: /\.scss$/, loader: "style!css!sass" },
            { test: /\.less$/, loader: "style!css!less" },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=999999' ,
            }
        ]
    },

    //插件项
    plugins: [
        new CommonsChunkPlugin('js/common.js'),
        new ExtractTextPlugin("css/styles.css"),
        new CleanWebpackPlugin([__dirname+'/webapp/wechat/'], {
            root: '', // An absolute path for the root  of webpack.config.js
            verbose: true,// Write logs to console.
            dry: false,// Do not delete anything, good for testing.
            exclude:['_health_check.php','do_not_delete','index-test.php','index.php','robots.txt','favicon.ico'],//排除
        }),
        new webpack.ProvidePlugin({
            '$'   : __dirname+'/wechat_src/lib/zepto/zepto.min.js',
            'Vue' : 'vue/dist/vue',
            // 'Vue' : __dirname+'/wechat_src/lib/vue.min.js',
        }),
    ]
}

// 多入口文件
function getEntry(){
    var entrys = {};
    var src = new RegExp(__dirname.replace(/\\/g, "/") + "/wechat_src/");
    glob.sync(__dirname + '/wechat_src/js/**/*.js').forEach(function(name) {
        // 前缀
        var entry = name.replace(src, "");

        // 后缀
        entry = entry.replace(/\.js$/, "");
        entrys[entry] = name;

        console.log("entry:"+name);
    });
    return entrys;
};

module.exports=config;