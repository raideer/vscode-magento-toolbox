/* eslint-disable @typescript-eslint/no-var-requires */
const extensionConfig = require('./webpack.config.ext');
const webviewConfig = require('./webpack.config.webview');
const serverConfig = require('./webpack.config.server');

module.exports = [extensionConfig, webviewConfig, serverConfig];
