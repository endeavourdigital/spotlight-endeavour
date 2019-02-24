const { dest, parallel, series, src, watch } = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const del = require('delete');
const browserSync = require('browser-sync').create();
const { rollup } = require('rollup');
const { uglify } = require('rollup-plugin-uglify');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');


/**
 * Nunjucks Task
 */
const compileViews = (cb) => {
  const config = require('./spotlight');

  src('./src/views/pages/**/*.html')
    .pipe(
      nunjucks({
        path: 'src/views/',
        data: config,
      })
    )
    .pipe(dest('./dist'))
  cb();
};

/**
 * Sass Task
 */
sass.compiler = require('node-sass');

const compileSass = (cb) => {
  src('./src/assets/styles/**/*.scss')
    .pipe(
      sass({
        includePaths: ['node_modules'],
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(dest('./dist/css'))
  cb();
};

/**
 * Javascript Task
 */
const compileJs = async function() {
  const bundle = await rollup({
    input: './src/assets/scripts/index.js',
    plugins: [
      resolve(),
      uglify(),
      babel({
        exclude: 'node_modules/**' // only transpile our source code
      })
    ]
  });

  return bundle.write({
    file: './dist/js/bundle.js',
    format: 'iife'
  });
}

/**
 * Images Task
 */
const images = (cb) => {
  src('./src/assets/images/*')
    .pipe(
      imagemin(
        [
          imageminMozjpeg({
            quality: 85
          }),
          imagemin.optipng({
            optimizationLevel: 5
          }),
          imagemin.svgo({
            plugins: [
              { removeViewBox: true },
              { cleanupIDs: false },
            ]
          })
        ]
      )
    )
    .pipe(dest('./dist/images'))
  cb();
};

/**
 * Clean Helper Method
 * This method is used to clear the dist/ folder to ensure the contents
 * of the dist/ folder is completely purged.
 */
const clean = (cb) => del(['./dist'], cb);

/**
 * Server Task
 * Generate a local web server.
 */
const server = (cb) => {
  browserSync.init({
    server: {
      baseDir: './dist',
    }
  })

  cb();
}

/**
 * Watcher Tasks
 */
watch(['./src/assets/scripts/**/*.js'], cb => compileJs(cb));
watch(['./src/assets/styles/**/*.scss'], cb => compileSass(cb));
watch(['./src/assets/images/*'], cb => images(cb));
watch(['./src/views/**/*.html'], cb => compileViews(cb));

/**
 * Export Tasks
 * These are tasks which are called via the cli.
 * E.g. `gulp assets` will run the exports.assets method.
 */
exports.views = compileViews;
exports.server = server;
exports.assets = parallel(compileSass, compileJs, images);

exports.local = series(
  clean,
  compileViews,
  parallel(compileSass, compileJs, images),
  server,
);

exports.default = series(
  clean,
  compileViews,
  parallel(compileSass, compileJs),
);