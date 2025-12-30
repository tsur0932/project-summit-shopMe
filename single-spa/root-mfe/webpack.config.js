const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = (env) => ({
  mode: "development",
  devtool: "source-map",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: true,
    port: 9090,
    hot: false,
    liveReload: false,
  },
  entry: "./src/ecommerce-root-config.js",
  output: {
    filename: "ecommerce-root-config.js",
    libraryTarget: "system",
    path: __dirname + "/dist",
    publicPath: "http://localhost:9090/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: "src/index.ejs",
      templateParameters: {
        isLocal: env && env.isLocal,
        orgName: "ecommerce",
      },
    }),
  ],
  externals: ["single-spa"],
  resolve: {
    modules: [__dirname, "node_modules"],
  },
});




