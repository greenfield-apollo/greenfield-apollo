// Karma configuration
// Generated on Mon Jun 30 2014 19:35:20 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // list of files / patterns to load in the browser
    files: [
      // angular source
      'client/lib/d3/d3.min.js',
      'client/lib/c3/c3.min.js',
      'client/lib/angular/angular.min.js',
      'client/lib/angular-route/angular-route.min.js',
      'client/lib/angular-sanitize/angular-sanitize.min.js',
      'client/lib/angular-mocks/angular-mocks.js',
      'client/lib/c3-angular/c3-angular.min.js',
      'client/lib/satellizer/satellizer.min.js',
      'client/lib/angular-notify/angular-notify.js',

      // our app code
      'client/app/**/*.js',

      // our spec files
      'node_modules/expect.js/index.js',
      'test/client/**/*.js'
    ],


    // list of files to exclude
    exclude: [
        'karma.conf.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {

    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS', 'Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
