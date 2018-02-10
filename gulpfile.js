'use strict';

const
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    //del = require('del'),
    //fs = require('fs'),
    babel = require('rollup-plugin-babel'),
    //babelHelpersList = require('babel-helpers').list,
    uglifyOptions = {output: {comments: /^!/}},
    copyright = '/*! Fast Average Color | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/fast-average-color/ */\n';

gulp
    .task('js', function() {
        return gulp.src('src/*.js')
            .pipe($.rollup({
                input: 'src/index.es6.js',
                output: {
                    format: 'umd',
                    name: 'FastAverageColor'
                },
                plugins: [babel({
                    //externalHelpersWhitelist: babelHelpersList.filter(helperName => helperName !== 'asyncGenerator')
                })]
            }))
            .pipe($.replace(/^/, copyright))
            .pipe($.rename('index.js'))
            .pipe(gulp.dest('dist/'));
    })
    .task('js.min', ['js'], function() {
        return gulp.src('dist/index.js')
            .pipe($.rename('index.min.js'))
            .pipe($.uglify(uglifyOptions))
            .pipe(gulp.dest('dist/'));
    })
    /*.task('dev-examples-copy', function() {
        return gulp
            .src('examples/*')
            .pipe(gulp.dest('dev-examples/'));
    })
    .task('dev-examples', ['dev-examples-copy'], function() {
        return gulp
            .src('dev-examples/*.html')
            .pipe($.replace(/https:\/\/unpkg\.com\/magic-snowflakes\//g, '../'))
            .pipe(gulp.dest('dev-examples/'));
    })*/
    .task('watch', function() {
        gulp.watch(['src/**/*', 'examples/**/*']);
    })
    .task('default', ['js.min']);
