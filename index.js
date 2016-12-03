'use strict';

const path = require('path');
const through = require('through2');

module.exports = function (file, opt) {
    if (!file) {
        throw new Error('gulp-concat: Missing file option');
    }

    opt = opt || {};

    console.log(file, opt)
}
