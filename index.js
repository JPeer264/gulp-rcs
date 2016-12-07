'use strict';

const path = require('path');
const rcs = require('rcs-core');
const through = require('through2');
const gutil = require('gulp-util');

module.exports = opt => {
    opt = opt || {};

    opt.css = opt.css || ['css'];

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        // @todo check if file.relative exists in opt.css
        if (path.extname(file.relative) === '.css') {
            rcs.replace.fileCss(file.path, (err, data) => {
                let newFile = new gutil.File({
                    cwd: file.cwd,
                    base: file.base,
                    path: file.path,
                    contents: new Buffer(data.data)
                });

                this.push(newFile);

                cb();
            });
        } else {
            rcs.replace.file(file.path, (err, data) => {
                let newFile = new gutil.File({
                    cwd: file.cwd,
                    base: file.base,
                    path: file.path,
                    contents: new Buffer(data.data)
                });

                this.push(newFile);

                cb();
            });
        }
    });
}
