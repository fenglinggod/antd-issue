const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const pkg = require('../package.json');


require('./env');

module.exports = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const shouldUseSourceMap = isEnvDevelopment;
  const injectStyleFile = `true;`;
  const publicPath = isEnvProduction
    ? `/unpkg/${pkg.name}@${pkg.version}/dist`.replace(/@see\//, '')
    : process.env.PUBLIC_URL;

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      {
        loader: 'style-loader',
        options: {
          attributes: { dxmpId: `${pkg.name}@${pkg.version}` },
        },
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
          ],
          sourceMap: isEnvProduction,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: isEnvProduction,
          modifyVars: {
            hack: injectStyleFile,
            '@primary-8': 'var(--primary-8)',
            '@primary-7': 'var(--primary-7)',
            '@primary-6': 'var(--primary-6)',
            '@primary-5': 'var(--primary-5)',
            '@primary-4': 'var(--primary-4)',
            '@primary-3': 'var(--primary-3)',
            '@primary-2': 'var(--primary-2)',
            '@primary-1': 'var(--primary-1)',
          },
          javascriptEnabled: true,
        },
      });
    }
    return loaders;
  };

  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    isEnvDevelopment &&
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(paths.public, 'index.html'),
        inject: true,
        favicon: path.resolve(paths.public, 'favicon.ico'),
      }),
    new webpack.DefinePlugin(webpackEnv),
  ].filter(Boolean);
  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    devtool: isEnvProduction ? false : 'cheap-module-source-map',
    entry: isEnvProduction ? paths.proIndex : paths.index,
    output: {
      path: paths.dist,
      libraryTarget: isEnvProduction ? 'commonjs' : 'umd',
    },
    externals: isEnvProduction
      ? {
          react: 'react',
          'react-dom': 'react-dom',
        }
      : {},
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
      runtimeChunk: false,
    },

    module: {
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        isEnvDevelopment && { parser: { requireEnsure: false } },
        // "url" loader works like "file" loader except that it embeds assets
        // smaller than specified limit in bytes as data URLs to avoid requests.
        // A missing `test` is equivalent to a match.
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        // Process application JS with Babel.
        // The preset includes JSX, Flow, TypeScript, and some ESnext features.
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          // enforce: 'pre',
          // include: [paths.src, paths.index],
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },

        {
          test: /\.css$/,
          exclude: /\.module\.css/,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isEnvProduction && shouldUseSourceMap,
          }),
        },

        {
          test: /\.less$/,
          exclude: /\.module\.less/,
          use: getStyleLoaders(
            {
              sourceMap: isEnvProduction && shouldUseSourceMap,
            },
            'less-loader',
          ),
        },
        {
          test: /\.module\.less$/,
          use: getStyleLoaders(
            {
              sourceMap: isEnvProduction && shouldUseSourceMap,
              modules: true,
            },
            'less-loader',
          ),
        },
        // "file" loader makes sure those assets get served by WebpackDevServer.
        // When you `import` an asset, you get its (virtual) filename.
        // In production, they would get copied to the `build` folder.
        // This loader doesn't use a "test" so it will catch all modules
        // that fall through the other loaders.
        {
          loader: require.resolve('file-loader'),
          // Exclude `js` files to keep "css" loader working as it injects
          // its runtime that would otherwise be processed through "file" loader.
          // Also exclude `html` and `json` extensions so they get processed
          // by webpacks internal loaders.
          exclude: [
            /\.(js|mjs|jsx|ts|tsx)$/,
            /\.html$/,
            /\.json$/,
            /\.(less|sass|css)$/,
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/,
          ],
          options: {
            publicPath,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ].filter(Boolean),
    },
    resolve: {
      alias: { '@': path.resolve('src'), '#': path.resolve('../') },
      extensions: ['.ts', '.js', '.json', '.tsx', '.jsx', '.css', '.less'],
    },
    plugins,
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
