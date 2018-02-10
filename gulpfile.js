'use strict';

const
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    babel = require('rollup-plugin-babel'),
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
                plugins: [babel()]
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
    .task('es6', function() {
        return gulp.src('src/index.es6.js')
            .pipe($.replace(/^/, copyright))
            .pipe(gulp.dest('dist/'));
    })
    .task('watch', function() {
        gulp.watch(['src/**/*', 'examples/**/*']);
    })
    .task('default', ['js.min', 'es6']);
