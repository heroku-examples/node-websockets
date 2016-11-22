if (process.env.NODE_ENV == 'development') {
    var requireDir = require('require-dir');
    requireDir('./gulp/tasks', { recurse: true });

    var gulp = require('gulp');
    var browserSync = require('browser-sync').create();
    browserSync.init();
    gulp.watch(["public/**"]).on('change', browserSync.reload);
} else {
    var requireDir = require('require-dir');
    requireDir('./gulp/tasks', { recurse: true });
}
