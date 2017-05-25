# gulp-rcs

[![Build Status](https://travis-ci.org/JPeer264/gulp-rcs.svg?branch=master)](https://travis-ci.org/JPeer264/gulp-rcs)

> [rcs](https://www.github.com/jpeer264/node-rcs-core) plugin for [Gulp](https://github.com/gulpjs/gulp).

> Minify all CSS selectors across all files

## Overview

- [Install](#install)
- [Basic Usage](#basic-usage-w-gulp-v3)
- [RCS Options](#options)
- [RCS Methods](#methods)

## Install

```sh
npm i gulp-rcs -D
```

or

```sh
yarn add gulp-rcs --dev
```

## Basic Usage (w/ Gulp v3)

> Make sure that you load all `css` files first. Files should **not** be minified/uglified.

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

Working with mappings (the mapping can look like [this](https://github.com/JPeer264/gulp-rcs/blob/master/test/files/results/renaming_map.json)):

```js
const rcs = require('gulp-rcs');

gulp.task('all', () => {
    return gulp.src(['./src/**/*.css', './src/**/*.js', './src/**/*.html'])
        .pipe(rcs({
            mapping: './config/renaming_map.json'
        }))
        ...
        .pipe(rcs.saveMapping('./config'))
})
```

## options

- [excludeFile](#optionsexcludefile)
- [exclude](#optionsexclude)
- [config](#optionsconfig)
- [mapping](#optionsmapping)
- [mappingOrigValues](#optionsmappingorigvalues)
- [css](#optionscss)
- [prefix](#optionsprefix)
- [suffix](#optionssuffix)
- [preventRandomName](#optionspreventrandomname)
- [replaceKeyframes](#optionsreplacekeyframes)

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

### options.mapping

Loads the mapping file to have always the same consistent renamings. Mappings can be loaded although they do not exist yet

Type: `String`

```js
...
    .pipe(rcs({
        mapping: 'path/to/the/mapping.json'
    }))
...
```

### options.mappingOrigValues

In case the min version of the mapping is saved, you have to set this option to `false`. Default: `true`

Type: `Boolean`

```js
...
    .pipe(rcs({
        mapping: 'path/to/the/mapping_min.json',
        mappingOrigValues: false
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

### options.replaceKeyframes

Renames the names in `animation-name` or `animation` if a specific `@keyframes` was triggered before. Default: `false`

Type: `Boolean`

```js
...
    .pipe(rcs({
        replaceKeyframes: true
    }))
...
```

## Methods

### rcs.writeMapping

`rcs.writeMapping(destPath[, options])`

> **Note:** This function should be at the end of the pipe (after all plugins)

This saves the mapping files to ensure all your project got the same selector replacements

#### options

- [cssMapping](#optionscssmapping)
- [cssMappingMin](#optionscssmappingmin)

##### options.cssMapping

This writes the mapping file. The **original** selectorname is the key. and the **renamed** selectorname is the value. The key has always the selector type (id `#` or class `.`). The string instead of a boolean will give the mapping an alternative name. The default name would be `renaming_map`

Type: `Boolean` or `String`

```js
...
    .pipe(rcs())
    ...
    .pipe(rcs.saveMapping('./', {
        cssMapping: 'my_mapping' // this will generate the mapping in `./my_mapping.json`
    }))
...
```

##### options.cssMappingMin

This writes the mapping file. The **renamed** selectorname is the key. and the **original** selectorname is the value (so the opposite of [cssMapping](#optionscssmapping)). The key has always the selector type (id `#` or class `.`). The string instead of a boolean will give the mapping an alternative name. The default name would be `renaming_map_min`

Type: `Boolean` or `String`

```js
...
    .pipe(rcs())
    ...
    .pipe(rcs.saveMapping('./', {
        cssMapping: false, // or leave it, if you still want to have it
        cssMappingMin: 'my_mapping_min' // this will generate the mapping in `./my_mapping_min.json`
    }))
...
```

## License

MIT © [Jan Peer Stöcklmair](https://www.jpeer.at/)
