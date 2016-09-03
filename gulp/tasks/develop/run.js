var gulp = require('gulp');
var livereload = require('gulp-livereload');

gulp.task('reload',function(){
     gulp.src(['public/*/*'])
     .pipe(livereload());
})
gulp.task('watch',['reload'],function(){
        livereload.listen();
        gulp.watch(['public/*/*','views/*.jade'],['gulp/tasks/server/*/*']);
})
