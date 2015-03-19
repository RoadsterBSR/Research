
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');

// Gulp plumber error handler
var onError = function (err) {
	console.log(err);
};

gulp.task('reload', function () {
	// Change the filepath, when you want to live reload a different page in your project.
	livereload.reload("./index.html");
});

// This task should be run, when you want to reload the webpage, when files change on disk.
// This task will only watch JavaScript file changes in the folder "/Client" and it's subfolders.
gulp.task('watch', function () {
	livereload.listen();
	gulp.watch('./Client/**/*.js', ['reload']);
});

// Hint all of our custom developed Javascript to make sure things are clean.
// This task will only hint JavaScript files in the folder "/Client" and it's subfolders.
gulp.task('jshint', function () {
	return gulp.src([
        './Client/**/*.js'
	])
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

// When the user enters "gulp" on the command line, the default task will automatically be called.
// This default task below, will run all other task automatically.
// So when the user enters "gulp" on the command line all task are run.
gulp.task('default', ['jshint']);