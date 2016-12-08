'use strict';

const rcs     = require('rcs-core');
const path    = require('path');
const gutil   = require('gulp-util');
const through = require('through2');

module.exports = opt => {
    opt = opt || {};

    opt.css = opt.css || ['css'];

    return through.obj(function (file, enc, cb) {
        let replaceFunction = rcs.replace.file;

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-rcs', 'Streaming not supported'));
            return;
        }

        // @todo check if file.relative exists in opt.css
        if (path.extname(file.relative) === '.css') {
            replaceFunction = rcs.replace.fileCss;
        }

        // calling the replace function from rcs-core
        replaceFunction(file.path, (err, data) => {
            if (err) {
                this.emit('error', new gutil.PluginError('gulp-rcs', err, {
                    fileName: file.path,
                    showProperties: false
                }));
            }

            let newFile = new gutil.File({
                cwd: file.cwd,
                base: file.base,
                path: file.path,
                contents: new Buffer(data.data)
            });

            this.push(newFile);

            cb();
        });
    });
};
