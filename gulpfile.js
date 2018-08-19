var gulp          = require('gulp');
var childProcess  = require('child_process');
var shell         = require('gulp-shell');
var browserSync   = require('browser-sync');
// var cp            = require('child_process');
const plumber     = require('gulp-plumber');
const newer       = require('gulp-newer');
const jfm         = require('jstransformer-jade-jekyll');
const minify      = require('gulp-minify');
const pug         = require('pug');
var gulpPug       = require('gulp-pug');

var prefix        = require('gulp-autoprefixer');
var sass          = require('gulp-sass');
var csso          = require('gulp-csso');
var htmlmin       = require('gulp-htmlmin');
var jsValidate    = require('gulp-jsvalidate');
var uglify        = require('gulp-uglify');
var pump          = require('pump');

var scsslint      = require('gulp-scss-lint');
var bootlint      = require('gulp-bootlint');
var html5Lint     = require('gulp-html5-lint');
var htmlhint      = require("gulp-htmlhint");

var imagemin      = require('gulp-imagemin');
var imageminSvgo  = require('imagemin-svgo');
var imageop       = require('gulp-image-optimization');
var rename        = require('gulp-rename');


var jekyll      = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var checkDeps   = require('gulp-check-deps');
var resolveDependencies = require('gulp-resolve-dependencies');
var concat      = require('gulp-concat');
var messages = {
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
gulp.task('htmlmin', function() {
    return gulp.src('_site/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeEmptyElements: true,
            lint: false,
        }))
        .pipe(gulp.dest('_site/'));
});


/**
 * Gulp task to compile files from _scss into both _site/css and minify CSS files
 */
gulp.task('sass', function () {
    return gulp.src('assets/css/main.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        // Auto-prefix css styles for cross browser compatibility
        .pipe(prefix({browsers: AUTOPREFIXER_BROWSERS}, { cascade: true }))
        // Minify the file
        .pipe(csso())
        // Output
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});

// gulp.task('build-js', function() {
//     return gulp.src('_site/js/*.js')
//         .pipe(jsValidate())
//         .pipe(uglify())
//         .pipe(gulp.dest('_site/js/'));
// });




// gulp.task('jekyll', shell.task(['jekyll build']));


gulp.task('build', ['jekyll'], function() {
    gulp.run('htmlmin');
});

// check tasks
gulp.task('check-html', function() {
    return gulp.src('_site/*.html')
        .pipe(html5Lint())
        .pipe(htmlhint())
        .pipe(bootlint());
});
//
// var scsslint = require('gulp-scss-lint');
// gulp.task('check-scss', function() {
//     gulp.src([ 'assets/css/**/*.scss' ])
//         .pipe(scsslint())
// });

gulp.task('check', [ 'check-html' ], function() {});



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
     gulp.watch('assets/css/**', ['sass']);
     gulp.watch('assets/js/**', ['jekyll-rebuild']);
     gulp.watch(['*.html', '_layouts/*.html', '_includes/*','assets/**/*', '_posts/*', '_config.yml'], ['jekyll-rebuild']);
     gulp.watch(['assets/js/**'], ['jekyll-rebuild']);
     gulp.watch('_jadefiles/**/*.jade', ['jade']);
     gulp.watch('_pugfiles/**/*.pug', ['pug']);
 });



/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
