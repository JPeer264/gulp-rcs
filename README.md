# gulp-rcs

> [rcs](https://www.github.com/jpeer264/node-rcs-core) plugin for [Gulp](https://github.com/gulpjs/gulp).

## Install

```sh
npm install gulp-rcs --save
```

or

```sh
yarn add gulp-rcs
```

## Basic Usage

> Make sure that you load all `css` files first.

All files at once:

```js
const rcs = require('gulp-rcs');

gulp.task('all', () => {
    return gulp.src(['./src/**/*.css', './src/**/*.js', './src/**/*.html'])
        .pipe(rcs())
        .pipe(gulp.dest('./dist/'));
});
```

Splitted (e.g. w/ [gulp-sass](https://github.com/dlmanning/gulp-sass)):

```js
const rcs = require('gulp-rcs');
const sass = require('gulp-sass');

gulp.task('css', (done) => {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rcs())
        .pipe(gulp.dest('./dist/'));

    done();
});

gulp.task('remainings', (done) => {
    // note that 'scss' files are here ignored
    gulp.src(['!./src/sass/**/*.scss', './src/**/*.js', './src/**/*.html'])
        .pipe(rcs())
        .pipe(gulp.dest('./dist/'));

    done();
});
```

## License

MIT © [Jan Peer Stöcklmair](https://www.jpeer.at/)