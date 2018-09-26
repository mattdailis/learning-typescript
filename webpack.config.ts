const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    CleanupPlugin = require('webpack-cleanup-plugin'),

    NODE_ENV = process.env.NODE_ENV,
    __DEV__ = NODE_ENV === 'development',
    __PROD__ = NODE_ENV === 'production',
    __TEST__ = NODE_ENV === 'test',
    // __COVERAGE__ = !argv.watch && __TEST__;
    __BASENAME__ = JSON.stringify(process.env.BASENAME || ''),
    ROOT = path.resolve(__dirname),
    DIST = path.join(ROOT, 'build'),
    SRC = path.join(ROOT, 'src/app'),
    PROJECT_PUBLIC_PATH = '/';

let debug = require('debug')('app:config:webpack');

// Base Configuration
let webpackConfig = {
    devtool: __DEV__ ? 'source-map' : '',
    mode: __PROD__ ? 'production' : 'development',
    module: {
        rules: [
            {
                loader: 'ts-loader',
                options: {
                    experimentalWatchApi: true,
                    transpileOnly: true,
                },
                test: /\.(ts|tsx)$/,

            },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', exclude: [path.join(ROOT, 'node_modules')] },
        ],
    },
    name: 'client',
    resolve: {
        alias: {
            '@Components': path.join(SRC, 'components'),
            '@Containers': path.join(SRC, 'containers'),
        },
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        modules: [ SRC, 'node_modules' ],
    },
    target: 'web',
    // To make typescript happy
    // tslint:disable-next-line:object-literal-sort-keys
    entry: undefined,
    output: undefined,
    plugins: undefined,
    optimization: undefined,
};

// Entry
const APP_ENTRY = path.join(SRC, 'App.tsx');
webpackConfig.entry = {
    app: [APP_ENTRY],
};

// Output
webpackConfig.output = {
    filename: '[name].[hash].bundle.js',
    path: DIST,
    pathinfo: false,
    publicPath: PROJECT_PUBLIC_PATH,
};

// Plugins
webpackConfig.plugins = [
    // new webpack.DefinePlugin(GLOBALS), // If the GLOBALS object is defined, source will be able to use these values
    // new CleanupPlugin(),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        hash: false,
        // favicon: path.join(SRC, 'favicon.ico'),
        inject: 'body',
        minify: { collapseWhitespace: true },
        template: path.join(SRC, 'index.html'),
        }),
    // new CopyWebpackPlugin([
    //   { from: 'src/images', to: 'images' },
    //   { from: 'src/fonts', to: 'fonts' }
    // ])
];

if (__DEV__) {
    debug('Enabling plugins for live development (HMR, NoErrors).');
    webpackConfig.plugins.push(
      new webpack.NoEmitOnErrorsPlugin(),
    );
} else if (__PROD__) {
    debug('Enabling plugins for production (OccurrenceOrder & UglifyJS).');
    webpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new UglifyJSPlugin({
        uglifyOptions: {
            compress: {
                dead_code: true,
                unused: true,
                warnings: false,
            },
        },
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
    );
}

// Optimization
if (!__TEST__) {
    webpackConfig.optimization = {
        splitChunks: {
            chunks: 'all',
        },
    };
}

module.exports = webpackConfig;
