'use strict';

const
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    rollup = require('gulp-rollup'),
    babel = require('rollup-plugin-babel'),
    packageJson = require('./package'),
    year = new Date().getFullYear(),
    copyright = `/*! Fast Average Color | © ${year} ${packageJson.author.name} | MIT License | ${packageJson.homepage} */\n`;

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

gulp.task('common.js', function() {
    return gulp.src('src/**/*.js')
        .pipe(rollup({
            input: 'src/index.js',
            output: { format: 'cjs' },
            plugins: [babel()]
        }))
        .pipe(replace(/^/, copyright))
        .pipe(rename('index.common.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('esm', function() {
    return gulp.src('src/**/*.js')
        .pipe(rollup({
            input: 'src/index.js',
            output: { format: 'es' }
        }))
        .pipe(replace(/^/, copyright))
        .pipe(rename('index.esm.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('es6', gulp.series('esm', function() {
    return gulp.src('dist/index.esm.js')
        .pipe(rename('index.es6.js'))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('min', gulp.series('js', function() {
    return gulp.src('dist/index.js')
        .pipe(rename('index.min.js'))
        .pipe(uglify({output: {comments: /^!/}}))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('watch', function() {
    gulp.watch(['src/**/*', 'examples/**/*']);
});

gulp.task('default', gulp.parallel('min', 'common.js', 'es6'));
