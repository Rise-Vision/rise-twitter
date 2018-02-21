'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    component: ['./src/rise-twitter.js'],
    vendor: [
      "@webcomponents/webcomponentsjs/custom-elements-es5-adapter",
      "@webcomponents/webcomponentsjs/webcomponents-lite",
      "web-component"
    ]
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'stage'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      //HTML
      {
        test: /\.html$/,
        include: [resolve('src')],
        exclude: /widget\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      }
    ]
  },
  node: {
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
