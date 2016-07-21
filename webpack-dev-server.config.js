module.exports = require("./webpack.config")({
    env: "dev",
    devServer: true,
    publicPath: "/",
    devtool: "cheap-module-eval-source-map",
    debug: true
});
