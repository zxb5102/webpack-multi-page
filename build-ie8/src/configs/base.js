const ExtractTextPlugin = require('extract-text-webpack-plugin')
const helpers = require('../../../build/src/utils/helpers')
const consts = require('../../../build/src/utils/consts')

const config = {
  entry: helpers.getEntry(),
  output: {
    path: consts.DIST,
    publicPath: consts.CDN,
    filename: `${consts.SCRIPTS}[name].js`,
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass?includePaths[]=' + consts.SRC + '/styles!postcss')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'html?interpolate&minimize=false'
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars',
        query: {
          inlineRequires: '\/images\/',
          helperDirs: [__dirname + '/../handlebars/helpers']
        }
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: `url?limit=8192&name=${consts.IMAGES}[hash].[ext]`
      }
    ]
  },
  postcss: [
    require('postcss-font-magician')(),
    require('cssnano')({
      filterPlugins: false,
      sourcemap: true,
      autoprefixer: {
        add: true,
        remove: true,
        browserslist: ['last 2 versions']
      },
      safe: true,
      discardComments: {
        removeAll: true
      }
    })
  ],
  plugins: [
    new require('es3ify-webpack-plugin')(),
    new ExtractTextPlugin(`${consts.STYLES}[name].css`),
    ...helpers.getPlugins()
  ],
  resolve: {
    root: __dirname,
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js', '.html', '.scss']
  }
}

module.exports = config
