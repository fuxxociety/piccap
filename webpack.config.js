const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ShebangPlugin = require('webpack-shebang-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => [
  // Frontend
  {
    target: 'browserslist',
    mode: env.production ? 'production' : 'development',
    entry: {
      'js/script.js': './piccap/js/script.js',
    },
    output: {
      path: path.resolve(__dirname, './dist/frontend/'),
      filename: '[name]',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /core-js/,
          use: 'babel-loader',
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ context: 'piccap', from: '**', to: '.' }],
      }),
    ],
  },

  // Service
  {
    target: 'node0.10',
    mode: env.production ? 'production' : 'development',

    // Builds with devtool support (development) contain very big eval chunks,
    // which seem to cause segfaults (at least) on nodeJS v0.12.2 used on webOS 3.x.
    // This feature makes sense only when using recent enough chrome-based
    // node inspector anyway.
    devtool: false,

    entry: {
      'service.js': './service/service.js',
    },
    output: {
      path: path.resolve(__dirname, './dist/service/'),
      filename: '[name]',
    },
    externals: {
      'webos-service': 'commonjs2 webos-service',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /core-js/,
          use: 'babel-loader',
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
        },
      }),
      new ShebangPlugin({
        chmod: 0o755,
      }),
      new CopyPlugin({
        patterns: ['service/package.json', 'service/services.json', 'service/autostart.sh'],
      }),
    ],
  },
];
