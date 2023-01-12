const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  target: 'web',
  output: {
    path: path.resolve(__dirname, './static/build/'),
    publicPath: '/static/build/',
    module: true,
    library: { type: 'module' },
    chunkFormat: 'module',
    chunkLoading: 'import',
    assetModuleFilename: '_assets/[name]-[contenthash][ext]',
    cssChunkFilename: '_assets/[name]-[contenthash][ext].css',
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name]-[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?$/,
        exclude: /node_modules/,
        loader: require.resolve('esbuild-loader'),
        options: {
          target: 'es2019',
          loader: 'tsx',
        },
      },
      {
        test: /\.module\.css$/i,
        use: [
          {
            loader: require.resolve('./loaders/remix-css-loader.js'),
            options: { emit: true },
          },
          {
            loader: 'css-loader',
            options: { modules: true },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',

    // treeshake unused code in development
    // needed so that browser build does not pull in server code
    usedExports: true,
    innerGraph: true,
    splitChunks: {
      chunks: 'async', // not all, async as workaround
    },
    minimize: true,
  },
  externalsType: 'module',
  experiments: {
    outputModule: true,
  },
}