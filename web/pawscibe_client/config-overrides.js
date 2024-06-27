const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');

module.exports = function override(config, env) {
  console.log('Original config:', config);

  config.plugins.push(
    new NodePolyfillPlugin(),
    new MonacoWebpackPlugin({
      languages: ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'yaml'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, '');
      const replacements = {
        net: 'net',
        util: 'util',
        path: 'path',
        http: 'stream-http',
        https: 'https-browserify',
        zlib: 'browserify-zlib',
        url: 'url',
        fs: 'browserify-fs',
        'fs/promises': 'browserify-fs',
        buffer: 'buffer',
        stream: 'stream-browserify',
        vm: 'vm-browserify',
        crypto: 'crypto-browserify',
        child_process: 'child_process-browser',
      };

      if (replacements[mod] !== undefined) {
        resource.request = replacements[mod];
      } else {
        throw new Error(`Module not found: ${mod}`);
      }
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /child_process/,
    })
  );

  config.resolve = {
    ...config.resolve,
    fallback: {
      fs: require.resolve('browserify-fs'),
      'fs/promises': require.resolve('browserify-fs'),
      child_process: false,
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      url: require.resolve('url/'),
      vm: require.resolve('vm-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      zlib: require.resolve('browserify-zlib'),
    },
  };

  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: 'pre',
    loader: require.resolve('source-map-loader'),
    resolve: {
      fullySpecified: false,
    },
  });

  config.module.rules.push({
    test: /pyodide\.mjs$/,
    parser: {
      requireEnsure: false,
    },
  });

  config.module.rules.push({
    test: /pyodide\.mjs$/,
    use: {
      loader: 'string-replace-loader',
      options: {
        search: 'require("child_process")',
        replace: 'null',
      },
    },
  });

  console.log('Modified config:', config);
  return config;
};