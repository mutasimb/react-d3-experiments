const gulp = require("gulp");
const sass = require("gulp-sass");
const gcmq = require('gulp-group-css-media-queries');
const csscomb = require('gulp-csscomb');

gulp.task(
  "sass",
  () => gulp.src("scss/**/*.scss")
    .pipe(sass())
    .pipe(gcmq())
    .pipe(csscomb())
    .pipe(gulp.dest("src"))
)

gulp.task("default", () => {
  gulp.watch("scss/**/*.scss", ["sass"]);
});
