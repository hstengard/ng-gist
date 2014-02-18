// Karma configuration
module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
//            'vendor/js/jquery.min.js',
//            'vendor/js/angular.min.js',
//            'vendor/js/angular-route.min.js',
//            'vendor/js/angular-mocks.js',
//            'vendor/js/_.js',
//            'vendor/js/restangular.js',
//            'app/login/login.js',
//            'app/login/*Spec.js',
//            'app/gist/gist.js',
//            'app/gist/*Spec.js',
//            'app/gist/*.html',
//            'app/login/*.html'
        ],

        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit'
        reporters: ['progress', 'junit'],

        junitReporter: {
            outputFile: 'test-results.xml'
        },

        preprocessors: {
            'app/gist/*.html' : ['ng-html2js'],
            'app/login/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            moduleName: 'test-templates'
        },

        // web server port
        port: 9876,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows)
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        plugins: ['karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-junit-reporter',
            'karma-ng-html2js-preprocessor']

    });

};
