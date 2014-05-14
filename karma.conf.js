// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/jsUri/Uri.min.js',
            'bower_components/jquery/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/js-markdown-extra/js-markdown-extra.js',
            'bower_components/stratajs/strata.js',
            'bower_components/ng-table/ng-table.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-treeview/angular.treeview.min.js',
            'app/common/**/*.js',
            'app/security/**/*.js',
            'app/search/**/*.js',
            'app/cases/**/*.js',
            'app/log_viewer/*.js',
            'test/spec/**/*.js',
            'app/**/*.html'

        ],

        ngHtml2JsPreprocessor: {
            // strip app from the file path
            stripPrefix: 'app/'
        },

        preprocessors: {
            'app/**/*.html': 'html2js'
        },

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


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


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};