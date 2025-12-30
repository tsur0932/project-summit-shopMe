const webpack = require("webpack");
const path = require("path");

module.exports = (env) => ({
  mode: "development",
  devtool: "source-map",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    port: 8082,
    historyApiFallback: true,
    hot: false,
    liveReload: false,
  },
  entry: "./src/ecommerce-cart.js",
  output: {
    filename: "ecommerce-cart.js",
    libraryTarget: "system",
    path: __dirname + "/dist",
    publicPath: "http://localhost:8082/",
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
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  externals: ["single-spa", "react", "react-dom"],
  resolve: {
    modules: [__dirname, "node_modules"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify({
        BFF_URL: env?.BFF_URL || "http://localhost:3000",
      }),
    }),

  ],
});
