var path = require('path');
module.exports = {
    context: path.resolve("./src/"),
    entry: "./main.js",
    output: {
        path: __dirname+"/public",
        filename: "diff.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    devtool: 'source-map'
};