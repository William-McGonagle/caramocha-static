function generateWebpack() {

    return `// webpack.config.js

// NOTE: Read [the documentation](https://webpack.js.org/configuration/#options) before you edit this file.

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'react', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        "@babel/preset-env", 
                        "@babel/preset-react"
                    ]
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ 
            template: path.resolve(__dirname, 'react', 'index.html') 
        })
    ]
};

    `;

}

function generateIndexJS() {

    return `// index.js

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<h1>Helloworld React!</h1>, document.getElementById('root'));
    `;
}

function generateIndexHtml(websiteData) {

    return `
<html>
    <head>
        <title>${websiteData.name}</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="bundle.js"></script>
    </body>
</html>`;
}

function generateFrontend(websiteData, zip) {

    var react = zip.folder('react');
    var webpack = zip.file('webpack.config.js', generateWebpack());

    var indexJs = react.file('index.js', generateIndexJS());
    var indexHtml = react.file('index.html', generateIndexHtml(websiteData));

    return react;

}