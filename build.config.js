module.exports = {
    build_dir: 'build',
    compile_dir: 'bin',

    app_files: {
        js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
        jsunit: [ 'src/**/*.spec.js' ],

//        coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
//        coffeeunit: [ 'src/**/*.spec.coffee' ],

        atpl: [ 'src/app/**/*.tpl.html' ],
//        ctpl: [ 'src/common/**/*.tpl.html' ],

        html: [ 'src/index.html' ],
        less: 'src/less/main.less'
    },

    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    },

    vendor_files: {
        js: [
            'vendor/jquery/jquery.min.js',
            'vendor/angular/angular.min.js',
            'vendor/angular-route/angular-route.min.js',
            'vendor/angular-animate/angular-animate.min.js',
            'vendor/bootstrap/dist/js/bootstrap.min.js',
            'vendor/lodash/dist/lodash.min.js',
            'vendor/restangular/dist/restangular.min.js'
        ],
        css: [

        ],
        assets: [
            'vendor/components-font-awesome/fonts/FontAwesome.otf',
            'vendor/components-font-awesome/fonts/fontawesome-webfont.eot',
            'vendor/components-font-awesome/fonts/fontawesome-webfont.svg',
            'vendor/components-font-awesome/fonts/fontawesome-webfont.ttf',
            'vendor/components-font-awesome/fonts/fontawesome-webfont.woff'
        ]
    }
};
