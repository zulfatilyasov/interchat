var gulp = require('gulp');
var jade = require('gulp-jade');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var coffee = require('gulp-coffee');
var rename = require('gulp-rename');
var jeet = require('jeet');
var nib = require('nib');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

var sources = {
  jade: "./src/**/*.jade",
  stylus: "./src/**/*.styl",
  coffee:"./src/**/*.coffee",
  scripts: "./assets/**/*.js"
};

// Define destinations object
var destinations = {
  html: ".",
  css: "./assets/",
  js: "./assets/"
};

// Compile and copy Jade
gulp.task("jade", function(event) {
  return gulp.src(sources.jade)
  .pipe(jade({pretty: true}))
  .pipe(gulp.dest(destinations.html))
});

// Compile and copy Stylus
gulp.task("stylus", function(event) {
  return gulp.src(sources.stylus).pipe(stylus({
    use: [nib(), jeet()],
    import: [
      'nib',
      'jeet'
    ],
    style: "compressed"
  })).pipe(gulp.dest(destinations.css));
});

// Minify and copy all JavaScript
gulp.task('scripts', function() {
  gulp.src(sources.scripts)
    .pipe(uglify())
    .pipe(gulp.dest(destinations.js));
});

// Server
gulp.task('server', function () {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(__dirname));
  app.listen(4000, '0.0.0.0');
});

// Watch sources for change, executa tasks
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(sources.jade, ["jade", "refresh"]);
  gulp.watch(sources.partials, ["jade", "refresh"]);
  gulp.watch(sources.stylus, ["stylus", "refresh"]);
  gulp.watch(sources.coffee, ["coffee", "refresh"]);
  gulp.watch(sources.scripts, ["scripts", "refresh"]);
});

gulp.task('coffee', function() {
  gulp.src('./src/**/*.coffee')
      .pipe(coffee({bare: true}))
      .pipe(rename('scripts.js'))
      .pipe(gulp.dest('./assets'))
});
// Refresh task. Depends on Jade task completion
gulp.task("refresh", ["jade"], function(){
  livereload.changed();
  console.log('LiveReload is triggered');
});

// Define default task
gulp.task("default", ["jade", "stylus", "coffee", "server", "watch"]);

