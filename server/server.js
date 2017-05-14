const express = require("express");
const path = require('path');
const config = require("../webpack.config.js");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.use(express.static('./dist'));

app.use('/', function(req, res) {
    res.sendFile(path.resolve('src/index.html'));
});

app.listen(port, function(error) {
    if (error) throw error;
    console.warn("Express server listening on port", port);
});
