module.exports = function ( karma ) {
    karma.set({
        basePath: '../',

        /**
         * This is the list of file patterns to load into the browser during testing.
         */
        files: [
            <% scripts.forEach( function ( file ) { %>'<%= file %>',
                <% }); %>
            'src/**/*.js'
  ],
  exclude: [
    'src/assets/**/*.js'
  ],
  frameworks: [ 'jasmine' ],
  plugins: [ 'karma-jasmine', 'karma-firefox-launcher', 'karma-chrome-launcher', 'karma-phantomjs-launcher', 'karma-coffee-preprocessor' ],

  /**
   * How to report, by default.
   */
  reporters: 'dots',

  /**
   * On which port should the browser connect, on which port is the test runner
   * operating, and what is the URL path for the browser to use.
   */
  port: 9018,
  runnerPort: 9101,
  urlRoot: '/',

            /**
            * Disable file watching by default.
            */
            autoWatch: false,
            browsers: [
            'PhantomJS'
  ],
  // If browser does not capture in given timeout [ms], kill it
  captureTimeout: 5000
});
};
