'use scrict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');

const config = configFactory('production');

const build = () => {
  console.log('Creating an optimized production build...');
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = {
          errors: [err.message],
          warnings: [],
        };
      } else {
        messages = stats.toJson({ all: false, warnings: true, errors: true });
      }

      if (messages.errors && messages.errors.length) {
        return reject(messages.errors.join('\n\n'));
      }
      return resolve(messages);
    });
  });
};

build()
  .then(messages => {
    if (messages.warnings.length) {
      console.log(chalk.yellow(messages.warnings));
    }
    console.log(chalk.green('Compiled successfully.\n'));
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    console.log(err);
    process.exit(1);
  });
