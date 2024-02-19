/* eslint-disable @typescript-eslint/no-var-requires */
const extensionConfig = require('./webpack.config.ext');
const webviewConfig = require('./webpack.config.webview');

module.exports = [extensionConfig, webviewConfig];
