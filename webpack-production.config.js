module.exports = [require("./webpack.config")({
    env: "prod",
    publicPath: "/"
}),
require('./webpack-server.config.js')
];
