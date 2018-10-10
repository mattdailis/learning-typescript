import Debug from 'debug';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import webpack from 'webpack';
// import CleanupPlugin from 'webpack-cleanup-plugin';

const NODE_ENV = process.env.NODE_ENV;
const __DEV__  = NODE_ENV === 'development';
const __PROD__ = NODE_ENV === 'production';
const __TEST__ = NODE_ENV === 'test';
// const __COVERAGE__ = !argv.watch && __TEST__;
const __BASENAME__ = JSON.stringify(process.env.BASENAME || '');
const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, 'build');
const SRC = path.join(ROOT, 'src/app');
const PROJECT_PUBLIC_PATH = '/';

const debug = Debug('app:config:webpack');

// Base Configuration
const webpackConfig: webpack.Configuration = {
    devtool: __DEV__ ? 'source-map' : null,
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
    // // To make typescript happy
    // // tslint:disable-next-line:object-literal-sort-keys
    // entry: undefined,
    // output: undefined,
    // plugins: undefined,
    // optimization: undefined,
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
        new webpack.optimize.OccurrenceOrderPlugin(false),
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
