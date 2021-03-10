'use scrict';

const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  dotenv: resolveApp('.env'),
  src: resolveApp('src'),
  index: resolveApp('index.jsx'),
  proIndex: resolveApp('src/build.tsx'),
  public: resolveApp('public'),
  dist: resolveApp('dist'),
};
