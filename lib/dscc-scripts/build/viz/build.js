"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const bluebird = require("bluebird");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require('vue-loader');
const util = require("./util");
const buildOptions = (buildValues) => {
    buildValues.jsonFile = buildValues.components[0].jsonFile; 
    buildValues.jsFile = buildValues.components[0].jsFile;
    buildValues.tsFile = buildValues.components[0].tsFile; 
    const plugins = [
        new webpack.DefinePlugin({
            DSCC_IS_LOCAL: 'false',
        }),

        // Add config
        new CopyWebpackPlugin([
            { from: path.join(buildValues.pwd, 'src', buildValues.jsonFile), to: '.' },
        ]),
        // Add manifest
        new CopyWebpackPlugin([
            {
                from: path.join('src', buildValues.manifestFile),
                to: '.',
                transform: (content) => {
                    const manifestContents = content.toString();
                    const newManifest = manifestContents
                        .replace(/CV_NAME/g, buildValues.name)
                        .replace(/CV_DESCRIPTION/g, buildValues.description)
                        .replace(/CV_ICON/g, buildValues.iconUrl)
                        .replace(/YOUR_GCS_BUCKET/g, buildValues.gcsBucket)
                        .replace(/DEVMODE_BOOL/g, `${buildValues.devMode}`);
                    return newManifest;
                },
            },
        ]),
        
        new VueLoaderPlugin()
    ];
    // Only add in the copy plugin for the css if the user provides a css value in
    // the manifest.
    if (buildValues.cssFile !== undefined) {
        plugins.push(new CopyWebpackPlugin([
            { from: path.join('src', buildValues.cssFile), to: '.' },
        ]));
    }
    // common options
    const webpackOptions = {
        plugins,
    };
    // Add js options, if set
    if (buildValues.jsFile) {
        const jsOptions = {
            output: {
                filename: buildValues.jsFile,
                path: path.resolve(buildValues.pwd, 'build'),
            },
            entry: {
                // this is the viz source code
                main: path.resolve(buildValues.pwd, 'src', buildValues.jsFile),
            },
        };
        Object.assign(webpackOptions, jsOptions);
    }
    // Add ts options, if set
    if (buildValues.tsFile) {
        const tsOptions = {
            output: {
                filename: buildValues.tsFile.replace('.ts', '.js'),
                path: path.resolve(buildValues.pwd, 'build'),
            },
            entry: {
                // this is the viz source code
                main: path.resolve(buildValues.pwd, 'src', buildValues.tsFile),
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: 'ts-loader',
                        exclude: /node_modules/,
                    }
                ],
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js'],
            },
        };
        Object.assign(webpackOptions, tsOptions);
    }
    if (buildValues.devMode) {
        const devOptions = {
            mode: 'development',
        };
        Object.assign(webpackOptions, devOptions);
    }
    else {
        const prodOptions = {
            mode: 'production',
        };
        Object.assign(webpackOptions, prodOptions);
    }

    const vueOptions = {
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
            ],
        }
    };
    Object.assign(webpackOptions, vueOptions);

    return webpackOptions;
};
exports.build = async (args) => {
    const buildValues = util.validateBuildValues(args);
    const webpackOptions = buildOptions(buildValues);
    const compiler = webpack(webpackOptions);
    const compilerRun = bluebird.promisify(compiler.run, { context: compiler });
    // Compile
    await compilerRun();
    // Validate output
    const cwd = process.cwd();
    const configDest = path.resolve(cwd, 'build', buildValues.jsonFile);
    util.validateConfigFile(configDest);
    const manifestDest = path.resolve(cwd, 'build', buildValues.manifestFile);
    util.validateManifestFile(manifestDest);
};
