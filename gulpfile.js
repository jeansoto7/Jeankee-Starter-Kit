var gulp               = require('gulp');
var plumber            = require('gulp-plumber');
var newer              = require('gulp-newer');
var concat             = require('gulp-concat');
var childProcess       = require('child_process');
var browserSync        = require('browser-sync');
var pug                = require('pug');
var jfm                = require('jstransformer-jade-jekyll');
var gulpPug            = require('gulp-pug');

var prefix             = require('gulp-autoprefixer');
var sass               = require('gulp-sass');
var minifyCss          = require('gulp-clean-css');
var htmlmin            = require('gulp-htmlmin');
var notify             = require("gulp-notify");

// var $                  = require('gulp-load-plugins')();
// var sourcemaps         = require('gulp-sourcemaps');
var reload             = browserSync.reload;

var jsValidate         = require('gulp-jsvalidate');
var uglify             = require('gulp-uglify');
var rename             = require('gulp-rename');
const size             = require('gulp-size');

// Gulp-Imagemin Read Documentation and usage at https://www.npmjs.com/package/gulp-imagemin
const imagemin         = require('gulp-imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng  = require('imagemin-optipng');
const imageminSvgo     = require('imagemin-svgo');


var jekyll              = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

////// uninstalled
// var scsslint           = require('gulp-scss-lint');
// var bootlint           = require('gulp-bootlint');
// var html5Lint          = require('gulp-html5-lint');
// var htmlhint           = require("gulp-htmlhint");
// var csso               = require('gulp-csso');
// var shell              = require('gulp-shell');
// var pump               = require('pump');
// const minify           = require('gulp-minify');
// var checkDeps           = require('gulp-check-deps');
// var resolveDependencies = require('gulp-resolve-dependencies');


var messages            = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ie_mob >= 8',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];


var displayError = function(error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin.error.bold + ']';
  errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if(error.fileName)
      errorString += ' in ' + error.fileName;

  if(error.lineNumber)
      errorString += ' on line ' + error.lineNumber.bold;

  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString);
};

var onError = function(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};


/**
 * Pug Configurations
 */
pug.filters.jfm = jfm.render;


/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return childProcess.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});



/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});



/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false
    });
});




// gulp.task('jekyll', function(cb) {
//     var child = childProcess.exec('jekyll build', function(error, stdout, stderr) {
//         cb(error);
//     });
// });




/**
 * Gulp task to minify HTML files
 */
gulp.task('compress-html', function() {
    return gulp.src('_site/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            // removeEmptyElements: true,
            removeOptionalTags: true,
            lint: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: false,
        }))
        .pipe(gulp.dest('_site/'))
        .pipe(size({
          title: 'html'
        }))
});

/**
 * Gulp task to compile files from _scss into both _site/css and minify CSS files
 */
gulp.task('sass', function () {
    return gulp.src('assets/css/main.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix({browsers: AUTOPREFIXER_BROWSERS}, { cascade: true }))
        .pipe(gulp.dest('assets/css'))
        .pipe(rename({suffix: '.min'}))
        // .pipe(rename('main.min.css'))
        .pipe(minifyCss())
        .pipe(size({
          title: 'css-compress'
        }))
        .pipe(gulp.dest('assets/css'))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
        // .pipe(notify({ message: 'Styles task complete' }));
});

/**
 * Gulp task to minify JS files
 */
gulp.task('compress-js', function() {
  return gulp.src('files/js/**')
    .pipe(plumber())
    .pipe(jsValidate())
    .pipe(uglify())
    .pipe(rename(function (path) {
        if(path.extname === '.js') {
            path.basename += '.min';
        }
    }))
    .pipe(size({
      title: 'js-compress'
    }))
    .pipe(gulp.dest('assets/js'))
});



// Optimize Images
gulp.task('compress-img', function() {
  return gulp.src('files/img/**')
    .pipe(plumber())
    .pipe(newer('assets/img/**'))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3})
    ]))
    .pipe(gulp.dest('assets/img'))
    .pipe(size({
      title: 'img'
    }))
});



/**
 * Pug Compiler
 */
gulp.task('pug', () => {
  gulp.src('_pugfiles/**/*.pug')
  .pipe(plumber())
  .pipe(gulpPug({
    pretty: true,
    pug: pug
  }))
  .pipe(gulp.dest('_includes'));
});


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
 gulp.task('watch', function () {
     gulp.watch(['*.html', '_layouts/*.html', '_includes/*','assets/**/*', '_posts/*', '_config.yml'], ['jekyll-rebuild']);
     gulp.watch('assets/css/**', ['sass']);
     // gulp.watch('assets/css/**', ['compress-css']);
     gulp.watch(['files/js/**'], ['compress-js']);
     gulp.watch(['files/img/**'], ['compress-img']);
     gulp.watch(['assets/js/**'], ['jekyll-rebuild']);
     gulp.watch('_jadefiles/**/*.jade', ['jade']);
     gulp.watch('_pugfiles/**/*.pug', ['pug']);
     gulp.watch(['_site/**/*.html'], ['compress-html']);
 });

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);



/**
 * PageSpeed Insights with reporting for both mobile and desktop
 */
var psi                = require('psi');
var site               = 'http://www.html5rocks.com';
var key                = '';

gulp.task('mobile', function () {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
    });
});

gulp.task('desktop', function () {
    return psi(site, {
        nokey: 'true',
        // key: key,
        strategy: 'desktop',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    });
});

gulp.task('speed', ['desktop', 'mobile']);
