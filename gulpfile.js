'use strict';

const
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    rollup = require('gulp-rollup'),
    babel = require('rollup-plugin-babel'),
    uglifyOptions = {output: {comments: /^!/}},
    copyright = '/*! Fast Average Color | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/fast-average-color/ */\n';

gulp
    .task('js', function() {
        return gulp.src('src/*.js')
            .pipe(rollup({
                input: 'src/index.js',
                output: {
                    format: 'umd',
                    name: 'FastAverageColor'
                },
                plugins: [babel()]
            }))
            .pipe(replace(/^/, copyright))
            .pipe(rename('index.js'))
            .pipe(gulp.dest('dist/'));
    })
    .task('js.min', ['js'], function() {
        return gulp.src('dist/index.js')
            .pipe(rename('index.min.js'))
            .pipe(uglify(uglifyOptions))
            .pipe(gulp.dest('dist/'));
    })
    .task('es6', function() {
        return gulp.src('src/index.js')
            .pipe(rename('index.es6.js'))
            .pipe(replace(/^/, copyright))
            .pipe(gulp.dest('dist/'));
    })
    .task('watch', function() {
        gulp.watch(['src/**/*', 'examples/**/*']);
    })
    .task('default', ['js.min', 'es6']);
