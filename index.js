'use strict';

const rcs     = require('rcs-core');
const path    = require('path');
const gutil   = require('gulp-util');
const gmatch  = require('gulp-match');
const through = require('through2');

module.exports = opt => {
    opt = opt || {};

    opt.css = opt.css || ['css'];

    return through.obj(function (file, enc, cb) {
        let data;
        let newFile;
        let replaceFunction = rcs.replace.buffer;

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-rcs', 'Streaming not supported'));
            return;
        }

        // @todo check if file.relative exists in opt.css
        if (path.extname(file.relative) === '.css') {
            replaceFunction = rcs.replace.bufferCss;
        }

        // if file is excluded
        if (gmatch(file, opt.exclude)) {
            this.push(file);

            return cb();
        }

        // calling the replace function from rcs-core
        data = replaceFunction(file.contents);

        file.contents = data;

        this.push(file);

        cb();
    });
};
