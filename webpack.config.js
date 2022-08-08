const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ];
  }

  return config;
};

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
  }

  if (preset) {
    opts.presets.push(preset)
  }
  return opts
}

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`);

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js'),
    clean: true,
  },
  devServer: {
    open: '/index.html',
    static: {	
      directory: './src',	
      watch: true,	
    },
  },
  optimization: optimization(),
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.pug',
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new ESLintPlugin(),
    ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelOptions(),

        },
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions('@babel/preset-typescript'),
          },
          {
            loader: 'ts-loader'
          },
        ]
        },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          root: path.resolve(__dirname, 'src'),
        },
      },
    ],
  },
};
