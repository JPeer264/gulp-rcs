'use strict';

const path = require('path');
const rcs = require('rcs-core');
const through = require('through2');

module.exports = opt => {
    opt = opt || {};

    opt.css = opt.css || ['css'];

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        // @todo check if file.relative exists in opt.css
        if (path.extname(file.relative) === '.css') {
            // @todo save all selectors into selectorLibrary from rcs-core
            console.log(file.relative)
        }

        // @todo rename this file based on the selectorLibrary from rcs-core

        this.push(file);

        cb();
    });
}
