/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const path = require('path');
// @ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig * */

/** @type WebpackConfig */
const webviewConfig = {
  target: 'node',
  mode: 'development',
  context: __dirname,
  entry: {
    webview: './src/webview/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                module: 'es6', // override `tsconfig.json` so that TypeScript emits native JavaScript modules.
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src/webview'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: 'log', // enables logging required for problem matchers
  },
};

module.exports = webviewConfig;
