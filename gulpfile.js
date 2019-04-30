'use strict';

const
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    rollup = require('gulp-rollup'),
    babel = require('rollup-plugin-babel'),
    copyright = '/*! Fast Average Color | © 2019 Denis Seleznev | MIT License | https://github.com/hcodes/fast-average-color/ */\n';

gulp.task('js', function() {
    return gulp.src('src/**/*.js')
        .pipe(rollup({
            input: 'src/index.js',
            output: {
                format: 'umd',
                name: 'FastAverageColor'
            },
            plugins: [babel()]
        }))
        .pipe(replace(/^/, copyright))
        .pipe(gulp.dest('dist/'));
});

gulp.task('es6', function() {
    return gulp.src('src/**/*.js')
        .pipe(rollup({
            input: 'src/index.js',
            output: { format: 'es' }
        }))
        .pipe(replace(/^/, copyright))
        .pipe(rename('index.es6.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('min', gulp.series('js', function min() {
    return gulp.src('dist/index.js')
        .pipe(rename('index.min.js'))
        .pipe(uglify({output: {comments: /^!/}}))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('watch', function() {
    gulp.watch(['src/**/*', 'examples/**/*']);
});

gulp.task('default', gulp.parallel('min', 'es6'));
