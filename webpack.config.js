const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const {getBuildableComponents} = require('./lib/dscc-scripts/build/viz/util');

const components = getBuildableComponents();
const componentIndexToBuild = Number(process.env.WORKING_COMPONENT_INDEX) || 0;
const component = components[componentIndexToBuild];

console.log(`Building ${component.tsFile || component.jsFile}...`);

const jsFilePath = path.resolve(__dirname, 'src', component.jsFile || '');

const plugins = [
  // Add DSCC_IS_LOCAL definition
  new webpack.DefinePlugin({
    DSCC_IS_LOCAL: 'true',
  }),
  new VueLoaderPlugin()
];

let body = '<div></div><script src="main.js"></script>';
const iframeHTML = `
<!doctype html>
<html><body>
${body}
</body></html>
`;

fs.writeFileSync(path.resolve(__dirname, 'dist', 'vizframe.html'), iframeHTML);

module.exports = [
  {
    mode: 'development',
    entry: jsFilePath,
    devServer: {
      contentBase: './dist',
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }, {
          test: /\.js$/,
          loader: 'babel-loader'
        }, {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        }, {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: plugins,
  }
];  
