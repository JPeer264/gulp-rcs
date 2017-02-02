# gulp-rcs

[![Build Status](https://travis-ci.org/JPeer264/gulp-rcs.svg?branch=master)](https://travis-ci.org/JPeer264/gulp-rcs)

> [rcs](https://www.github.com/jpeer264/node-rcs-core) plugin for [Gulp](https://github.com/gulpjs/gulp).

> Minify all CSS selectors across all files

## Install

```sh
npm i gulp-rcs -D
```

or

```sh
yarn add gulp-rcs --dev
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

gulp.task('css', () => {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rcs())
        .pipe(gulp.dest('./dist/'));
});

// here we will wait until, css is finished
gulp.task('remainings', ['css'], () => {
    // note that 'scss' files are here ignored
    return gulp.src(['!./src/sass/**/*.scss', './src/**/*.js', './src/**/*.html'])
        .pipe(rcs())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['css', 'remainings']);
```

## options

- [excludeFile](#optionsexcludefile)
- [exclude](#optionsexclude)
- [config](#optionsconfig)
- [css](#optionscss)
- [prefix](#optionsprefix)
- [suffix](#optionssuffix)
- [preventRandomName](#optionspreventrandomname)

**Short example how it could look like:**

```js
const rcs = require('gulp-rcs');

gulp.task('myTask', () => {
    return gulp.src('**/*')
        .pipe(rcs([options]))
        .pipe(gulp.dest('./dist/'));
});
```

### options.excludeFile

Excludes specific files or directories.

Type: `Array` or `String`, any valid `glob` statement

```js
...
    .pipe(rcs({
        excludeFile: ['**/vendor.js', '**/another.js']
    }))
...
```

### options.exclude

Excludes specific selectors.

Type: `Array` or `String`

```js
...
    .pipe(rcs({
        exclude: ['any-selector', 'to-exclude']
    }))
...
```

### options.config

Set another path to the config file. If set to `false` it will not load any config file.

Type: `String` or `Boolean`

```js
...
    .pipe(rcs({
        config: './path/to/config/file'
    }))
...
```

### options.css

Enable specific CSS files. Any given extension will be excepted.

Type: `Array` or `String`

In the following example only `.css` and `.scss` files will rename new selectors.

```js
...
    .pipe(rcs({
        css: ['.css', '.scss']
    }))
...
```

### options.prefix

Prefixes all selectors, excluding the exludes.

Type: `String`

```js
...
    .pipe(rcs({
        prefix: 'my-super-cool-prefix-'
    }))
...
```

### options.suffix

Suffixes all selectors, excluding the exludes.

Type: `String`

```js
...
    .pipe(rcs({
        suffix: '-my-suffix'
    }))
...
```

### options.preventRandomName

Does not rename the selectors (good for prefixing/suffixing).

Type: `Boolean`

```js
...
    .pipe(rcs({
        preventRandomName: true,
        prefix: 'my-super-cool-prefix-' // prefix it, otherwise there is no real effect
    }))
...
```


## License

MIT © [Jan Peer Stöcklmair](https://www.jpeer.at/)
