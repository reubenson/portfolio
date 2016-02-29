var gulp = require('gulp');
var jshint = require('gulp-jshint');
var babel = require('gulp-babel');


var paths = {
  scripts: 'public/javascripts/ice/*.es6'
}

gulp.task('default', function () {
  return gulp
    .src(paths.scripts)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest("public/javascripts/ice"))
    // .pipe(gulp.dest('dist'));
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['default']);
});
