var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var sass          = require('gulp-sass');
var prefix        = require('gulp-autoprefixer');
var cp            = require('child_process');
const plumber     = require('gulp-plumber');
const newer       = require('gulp-newer');
const pug         = require('pug');
const jfm         = require('jstransformer-jade-jekyll');
var gulpPug       = require('gulp-pug');

var csso          = require('gulp-csso');
var uglify        = require('gulp-uglify');
var pump          = require('pump');
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
  'ie >= 10',
  'ie_mob >= 10',
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
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
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

/**
 * Javascript Minifyer
 */
// gulp.task('compress', function() {
//   gulp.src('lib/*.js')
//     .pipe(minify({
//         ext:{
//             src:'-debug.js',
//             min:'.js'
//         },
//         exclude: ['tasks'],
//         ignoreFiles: ['.combo.js', '-min.js']
//     }))
//     .pipe(gulp.dest('dist'))
// });


/**
 * Automatic Image Compressor
 */
//gulp.task('image', function(){
    //gulp.src('images/*')
        //.pipe(imagemin())
        //.pipe(gulp.dest('assets/img'))
//});


//imagemin(['images/*.svg'], 'build/images', {
//    use: [
//        imageminSvgo({
//            plugins: [
//                {removeViewBox: false}
//            ]
//        })
//    ]
//}).then(() => {
//    console.log('Images optimized');
//});


//gulp.task('images', function(cb) {
//    gulp.src(['images/*.png','images/*.jpg','images/*.gif','images/*.jpeg']).pipe(imageop({
//        optimizationLevel: 5,
//        progressive: true,
//        interlaced: true
//    })).pipe(gulp.dest('assets/img')).on('end', cb).on('error', cb);
//});


/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
// gulp.task('sass', function () {
//     return gulp.src('assets/css/main.scss')
//         .pipe(sass({
//             includePaths: ['css'],
//             onError: browserSync.notify
//         }))
//         .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//         .pipe(gulp.dest('_site/assets/css'))
//         .pipe(browserSync.reload({stream:true}))
//         .pipe(gulp.dest('assets/css'));
// });


/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */

// Gulp task to minify CSS files
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


// // Gulp task to minify JavaScript files
// gulp.task('scripts', function() {
//   return gulp.src('assets/js/*.js')
//     // Minify the file
//     .pipe(uglify())
//     // Output
//     .pipe(gulp.dest('_site/assets/js'))
//     .pipe(browserSync.reload({stream:true}))
//     .pipe(gulp.dest('assets/js'));
// });

// Gulp task to minify JavaScript files
// gulp.task('compress', function(cb) {
//   pump([
//         gulp.src('assets/js/*.js'),
//         uglify(),
//         gulp.dest('_site/assets/js'),
//         browserSync.reload({stream:true}),
//         gulp.dest('assets/js')
//     ],
//     cb
//   );
// });


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



//gulpfile.js

gulp.task('check:deps', function() {
    return gulp.src('package.json').pipe(checkDeps());
});


gulp.task('js', function(){
  gulp.src(['app/assets/js/main.js'])
    .pipe(resolveDependencies({
      pattern: /\* @requires [\s-]*(.*\.js)/g
    }))
        .on('error', function(err) {
            console.log(err.message);
        })
    .pipe(concat())
    .pipe(gulp.dest('dest/assets/js/'));
});


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
