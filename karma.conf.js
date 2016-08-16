'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'tests.bundle.js',
            'bower_components/angular-chosen-localytics/chosen.js',
        ],

        preprocessors: {
            'app/**/*.module.js': ['webpack', 'sourcemap'],
            // 'app/main.module.js': ['webpack', 'sourcemap'],
            'test/mocks/*.js': ['webpack', 'sourcemap'],
            'tests.bundle.js': ['webpack', 'sourcemap']
        },

        webpack: {
            // devtool: 'eval',
            devtool: 'source-map',
            module: {
                loaders: [
                    { test: /[\/]angular\.js$/, loader: "exports?angular"},
                    { test: /\.test\.js/, loader: "ng-annotate?add=true!babel"},
                    {
                        test: /redhat_access_pcm_ascension_common/,
                        loader: 'ng-annotate?add=true!babel'
                    },
                    {
                        test: /\.js/,
                        loader: "ng-annotate?add=true!isparta",
                        exclude: [
                            path.resolve(__dirname, 'node_modules'),
                            path.resolve(__dirname, 'bower_components'),
                            /translations\.js/,
                            /test\.bundle\.js/,
                            /test\.js/,
                            /test\/mocks\/*/
                        ]
                    },
                    { test: /\.css$/, loader: 'style!css'},
                    {
                        test: /\.(jpe?g|png|gif|svg)/i,
                        loader: 'null-loader'
                    },
                    { test: /\.(woff|woff2)/, loader: 'null' },
                    { test: /\.(ttf|eot)/, loader: 'null'},
                    { test: /\.html$/, loader: 'raw' },
                    { test: /\.txt$/, loader: 'raw' },
                    { test: /\.jade$/, loader: 'null' }
                ]
            },
            resolve: {
                modulesDirectories: ["node_modules", "bower_components"],
                alias: {
                    'moment-timezone': 'moment-timezone/builds/moment-timezone-with-data-2010-2020.js'
                }
            },
            plugins: [
                new webpack.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery',
                    Uri: 'jsuri'
                }),
                new webpack.DefinePlugin({
                    ENVIRONMENT: JSON.stringify('test')
                })
            ]
        },
        webpackMiddleware: {
            noInfo: true
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage'
        },

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        customLaunchers: {
            'PhantomJS': {
                base: 'PhantomJS',
                options: {
                    windowName: 'PCM testing',
                    settings: {
                        webSecurityEnabled: false
                    },
                },
                flags: ['--disk-cache=false'],
                debug: true
            }
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        plugins: [
            require('karma-webpack'),
            require('karma-coverage'),
            require('karma-jasmine'),
            require('karma-sourcemap-loader'),
            require('karma-phantomjs-launcher'),
            require('karma-firefox-launcher'),
            require('karma-chrome-launcher'),
            require('karma-script-launcher')
        ],

        client: {
            captureConsole: true
        }
    });
};
//
//
//
// 'use strict';
// // Karma configuration
// // http://karma-runner.github.io/0.10/config/configuration-file.html
//
// module.exports = function(config) {
//     config.set({
//         // base path, that will be used to resolve files and exclude
//         basePath: '',
//
//         // testing framework to use (jasmine/mocha/qunit/...)
//         frameworks: ['jasmine'],
//
//         // list of files / patterns to load in the browser
//         files: [
//             'bower_components/jsUri/Uri.js',
//             'bower_components/udsjs/dist/uds.js',
//             'bower_components/jquery/jquery.js',
//             'bower_components/angular/angular.js',
//             'bower_components/bootstrap/dist/js/bootstrap.js',
//             'bower_components/angular-gettext/dist/angular-gettext.min.js',
//             'bower_components/angular-chosen-localytics/chosen.js',
//             'bower_components/chosen/chosen.jquery.js',
//             'bower_components/angular-resource/angular-resource.js',
//             'bower_components/angular-sanitize/angular-sanitize.js',
//             'bower_components/angular-route/angular-route.js',
//             'bower_components/angular-ui-router/release/angular-ui-router.js',
//             'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
//             'bower_components/stratajs/strata.js',
//             'bower_components/ng-table/ng-table.js',
//             'bower_components/angular-mocks/angular-mocks.js',
//             'bower_components/angular-cache/dist/angular-cache.js',
//             'bower_components/angular-treeview/angular.treeview.min.js',
//             'bower_components/bluebird/js/browser/bluebird.min.js',
//             'bower_components/angular-md5/angular-md5.js',
//             'bower_components/sinon/lib/sinon.js',
//             'bower_components/sinon/lib/sinon/spy.js',
//             'bower_components/sinon/lib/sinon/call.js',
//             //'bower_components/sinon/lib/sinon/behavior.js',
//             'bower_components/sinon/lib/sinon/stub.js',
//             'bower_components/sinon/lib/sinon/mock.js',
//             'bower_components/sinon/lib/sinon/collection.js',
//             'bower_components/sinon/lib/sinon/assert.js',
//             'bower_components/sinon/lib/sinon/sandbox.js',
//             'bower_components/sinon/lib/sinon/test.js',
//             'bower_components/sinon/lib/sinon/test_case.js',
//             'bower_components/sinon/lib/sinon/assert.js',
//             'bower_components/sinon/lib/sinon/match.js',
//             'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
//             'bower_components/moment/moment.js',
//             'bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
//             '.tmp/templates/RedhatAccess.template.js',
//             'bower_components/redhat-access-angular-ui-common/dist/redhat_access_angular_ui_common.js',
//             'app/**/*.module.js', //define all modules first!
//             'app/search/**/*.js',
//             'app/cases/**/*.js',
//             'app/log_viewer/*.js',
//             'test/mocks/**/*.js',
//             'test/spec/**/*.js'
//             //'app/**/*.html'
//
//         ],
//
//         // ngHtml2JsPreprocessor: {
//         //     // strip app from the file path
//         //     stripPrefix: 'app/'
//         // },
//
//         // preprocessors: {
//         //     'app/**/*.html': 'html2js'
//         // },
//         // generate js files from html templates
//         preprocessors: {
//             'app/cases/**/*.js': ['coverage'],
//             // 'app/ascension/**/*.js': ['coverage']
//         },
//
//         reporters: ['progress', 'coverage'],
//
//         coverageReporter: {
//             type: 'lcov',
//             dir: 'test/coverage'
//         },
//
//         // list of files / patterns to exclude
//         exclude: [],
//
//         // web server port
//         port: 8080,
//
//         // level of logging
//         // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
//         logLevel: config.LOG_INFO,
//
//
//         // enable / disable watching file and executing tests whenever any file changes
//         autoWatch: false,
//
//
//         // Start these browsers, currently available:
//         // - Chrome
//         // - ChromeCanary
//         // - Firefox
//         // - Opera
//         // - Safari (only Mac)
//         // - PhantomJS
//         // - IE (only Windows)
//         browsers: ['PhantomJS'],
//
//
//         // Continuous Integration mode
//         // if true, it capture browsers, run tests and exit
//         singleRun: true
//     });
// };

//
// 'use strict';
// // Karma configuration
// // http://karma-runner.github.io/0.10/config/configuration-file.html
//
// module.exports = function(config) {
//     config.set({
//         // base path, that will be used to resolve files and exclude
//         basePath: '',
//
//         // testing framework to use (jasmine/mocha/qunit/...)
//         frameworks: ['jasmine'],
//
//         // list of files / patterns to load in the browser
//         files: [
//             'bower_components/jsUri/Uri.js',
//             'bower_components/udsjs/dist/uds.js',
//             'bower_components/jquery/jquery.js',
//             'bower_components/angular/angular.js',
//             'bower_components/bootstrap/dist/js/bootstrap.js',
//             'bower_components/angular-gettext/dist/angular-gettext.min.js',
//             'bower_components/angular-chosen-localytics/chosen.js',
//             'bower_components/chosen/chosen.jquery.js',
//             'bower_components/angular-resource/angular-resource.js',
//             'bower_components/angular-sanitize/angular-sanitize.js',
//             'bower_components/angular-route/angular-route.js',
//             'bower_components/angular-ui-router/release/angular-ui-router.js',
//             'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
//             'bower_components/stratajs/strata.js',
//             'bower_components/ng-table/ng-table.js',
//             'bower_components/angular-mocks/angular-mocks.js',
//             'bower_components/angular-cache/dist/angular-cache.js',
//             'bower_components/angular-treeview/angular.treeview.min.js',
//             'bower_components/bluebird/js/browser/bluebird.min.js',
//             'bower_components/angular-md5/angular-md5.js',
//             'bower_components/sinon/lib/sinon.js',
//             'bower_components/sinon/lib/sinon/spy.js',
//             'bower_components/sinon/lib/sinon/call.js',
//             //'bower_components/sinon/lib/sinon/behavior.js',
//             'bower_components/sinon/lib/sinon/stub.js',
//             'bower_components/sinon/lib/sinon/mock.js',
//             'bower_components/sinon/lib/sinon/collection.js',
//             'bower_components/sinon/lib/sinon/assert.js',
//             'bower_components/sinon/lib/sinon/sandbox.js',
//             'bower_components/sinon/lib/sinon/test.js',
//             'bower_components/sinon/lib/sinon/test_case.js',
//             'bower_components/sinon/lib/sinon/assert.js',
//             'bower_components/sinon/lib/sinon/match.js',
//             'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
//             'bower_components/moment/moment.js',
//             'bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
//             '.tmp/templates/RedhatAccess.template.js',
//             'bower_components/redhat-access-angular-ui-common/dist/redhat_access_angular_ui_common.js',
//             'app/**/*.module.js', //define all modules first!
//             'app/search/**/*.js',
//             'app/cases/**/*.js',
//             'app/log_viewer/*.js',
//             'test/mocks/**/*.js',
//             'test/spec/**/*.js'
//             //'app/**/*.html'
//
//         ],
//
//         // ngHtml2JsPreprocessor: {
//         //     // strip app from the file path
//         //     stripPrefix: 'app/'
//         // },
//
//         // preprocessors: {
//         //     'app/**/*.html': 'html2js'
//         // },
//         // generate js files from html templates
//         preprocessors: {
//             'app/cases/**/*.js': ['coverage'],
//             // 'app/ascension/**/*.js': ['coverage']
//         },
//
//         reporters: ['progress', 'coverage'],
//
//         coverageReporter: {
//             type: 'lcov',
//             dir: 'test/coverage'
//         },
//
//         // list of files / patterns to exclude
//         exclude: [],
//
//         // web server port
//         port: 8080,
//
//         // level of logging
//         // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
//         logLevel: config.LOG_INFO,
//
//
//         // enable / disable watching file and executing tests whenever any file changes
//         autoWatch: false,
//
//
//         // Start these browsers, currently available:
//         // - Chrome
//         // - ChromeCanary
//         // - Firefox
//         // - Opera
//         // - Safari (only Mac)
//         // - PhantomJS
//         // - IE (only Windows)
//         browsers: ['PhantomJS'],
//
//
//         // Continuous Integration mode
//         // if true, it capture browsers, run tests and exit
//         singleRun: true
//     });
// };

