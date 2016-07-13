var path = require('path');
/**
 * Трансплиер кода из ES6 (ES2015) в более поддерживаемый стандарт
 * Так же, позволяет использовать require в коде
 */
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