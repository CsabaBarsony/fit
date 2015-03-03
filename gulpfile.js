var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var jest = require('gulp-jest');
var uglify = require("gulp-uglify");
var streamify = require("gulp-streamify");

function compile(){
	return browserify('./src/scripts/main.js', { debug: true })
		.transform(reactify)
		.bundle()
		.pipe(source('bundle.js'))
		//uglify:
		//.pipe(streamify(uglify()))
		.pipe(gulp.dest('./public/js/'));
}

gulp.task("default", function(){
	compile();
});

gulp.task('compile', function() {
	compile();
});

gulp.task("watch", function() {
	compile();
	gulp.watch('./src/**/*.js', ['compile']);
});

/*
Not working yet, use command: 'npm test' instead
gulp.task('jest', function () {
	return gulp.src('__tests__').pipe(jest({
		scriptPreprocessor: "./spec/support/preprocessor.js",
		unmockedModulePathPatterns: [
			"node_modules/react"
		],
		testDirectoryName: "spec",
		testPathIgnorePatterns: [
			"node_modules",
			"spec/support"
		],
		moduleFileExtensions: [
			"js",
			"json",
			"react"
		]
	}));
});*/
