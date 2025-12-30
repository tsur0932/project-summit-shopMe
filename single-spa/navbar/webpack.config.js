const webpack = require("webpack");

module.exports = (env) => ({
  mode: "development",
  devtool: "source-map",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    port: 8085,
    historyApiFallback: true,
    hot: false,
    liveReload: false,
  },
  entry: "./src/ecommerce-navbar.js",
  output: {
    filename: "ecommerce-navbar.js",
    libraryTarget: "system",
    path: __dirname + "/dist",
    publicPath: "http://localhost:8085/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
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
      extensions: [".js", ".jsx"],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({
          BFF_URL: env?.BFF_URL || "http://localhost:3000",
        }),
      }),
    ],
});




