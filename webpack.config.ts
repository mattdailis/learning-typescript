const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    CleanupPlugin = require('webpack-cleanup-plugin'),

    NODE_ENV = process.env.NODE_ENV,
    __DEV__ = NODE_ENV === 'development',
    __PROD__ = NODE_ENV === 'production',
    __TEST__ = NODE_ENV === 'test',
    //__COVERAGE__ = !argv.watch && __TEST__;
    __BASENAME__ = JSON.stringify(process.env.BASENAME || ''),
    ROOT = path.resolve(__dirname),
    DIST = path.join(ROOT, 'build'),
    SRC = path.join(ROOT, 'src/app'),
    PROJECT_PUBLIC_PATH = '/';

var debug = require('debug')('app:config:webpack');

// Base Configuration
var webpackConfig = {
    name: 'client',
    target: 'web',
    mode: __PROD__ ? 'production' : 'development',
    devtool: 'source-map',
    resolve: {
        modules: [ SRC, 'node_modules' ],
        //extensions: ['.ts', 'tsx', '.js', '.json']
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: {
            "@Components": path.join(SRC, 'components'),
            "@Containers": path.join(SRC, 'containers')
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                },
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader", exclude: [path.join(ROOT, 'node_modules')] }
        ]
    },
    // To make typescript happy
    entry: undefined,
    output: undefined,
    plugins: undefined,
    optimization: undefined
};
  
// Entry
const APP_ENTRY = path.join(SRC, 'App.tsx');
const WEBPACK_DEV_SERVER = `webpack-dev-server/client?path=${PROJECT_PUBLIC_PATH}`
webpackConfig.entry = {
    app: __DEV__
      ? [WEBPACK_DEV_SERVER, APP_ENTRY]
      : [APP_ENTRY]
};

// Output
webpackConfig.output = {
    path: DIST,
    filename: 'js/[name].[hash].bundle.js',
    pathinfo: false,
    publicPath: PROJECT_PUBLIC_PATH
}

// Plugins
webpackConfig.plugins = [
    // new webpack.DefinePlugin(GLOBALS), // If the GLOBALS object is defined, source will be able to use these values
    //new CleanupPlugin(),
    new HtmlWebpackPlugin({
        template: path.join(SRC, 'index.html'),
        hash: false,
        // favicon: path.join(SRC, 'favicon.ico'),
        filename: 'index.html',
        inject: 'body',
        minify: { collapseWhitespace: true }
        }),
    // new CopyWebpackPlugin([
    //   { from: 'src/images', to: 'images' },
    //   { from: 'src/fonts', to: 'fonts' }
    // ])
];

if (__DEV__) {
    debug('Enabling plugins for live development (HMR, NoErrors).')
    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
} else if (__PROD__) {
    debug('Enabling plugins for production (OccurrenceOrder & UglifyJS).')
    webpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new UglifyJSPlugin({
        uglifyOptions: {
            compress: {
            unused: true,
            dead_code: true,
            warnings: false
            }
        }
        }),
        new webpack.optimize.AggressiveMergingPlugin()
    )
}

// Optimization
if (!__TEST__) {
    webpackConfig.optimization = {
        splitChunks: {
            chunks: 'all'
        }
    }
}

module.exports = webpackConfig;