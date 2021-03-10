'use scrict';

process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const configFactory = require('../config/webpack.config');
const devServerConfig = require('../config/webpackDevServer.config');

process.on('unhandledRejection', err => {
  throw err;
});

const config = configFactory('development');
const compiler = webpack(config);
const devServer = new WebpackDevServer(compiler, devServerConfig);

const port = process.env.PORT || 9000;
const HOST = process.env.HOST || '0.0.0.0';
devServer.listen(port, HOST, err => {
  if (err) {
    return console.log(err);
  }
  console.log('Starting the development server...\n');
});
