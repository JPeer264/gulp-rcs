'use strict';

const rcs      = require('rcs-core');
const path     = require('path');
const json     = require('json-extra');
const gutil    = require('gulp-util');
const gmatch   = require('gulp-match');
const through  = require('through2');
const includes = require('array-includes');

module.exports = opt => {
    opt = opt || {};

    opt.css = opt.css || ['.css', '.sass', '.scss'];
    opt.css = typeof opt.css === 'string' ? [ opt.css ] : opt.css;

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

        if (opt.config !== false) {
            includeConfig(opt.config);
        }

        rcs.selectorLibrary.setExclude(opt.exclude);

        if (includes(opt.css, path.extname(file.relative))) {
            replaceFunction = rcs.replace.bufferCss;
        }

        // if file is excluded
        if (gmatch(file, opt.excludeFile)) {
            this.push(file);

            return cb();
        }

        // calling the replace function from rcs-core
        data = replaceFunction(file.contents, {
            prefix: opt.prefix,
            suffix: opt.suffix,
            preventRandomName: opt.preventRandomName,
        });

        file.contents = data;

        this.push(file);

        cb();
    });

    function includeConfig(pathString) {
        let configObject;

        pathString   = pathString || path.join(process.cwd(), '.rcsrc');
        configObject = json.readToObjSync(pathString);

        if (!configObject) {
            // package.json .rcs if no other config is found
            configObject = json.readToObjSync(path.join(process.cwd(), 'package.json')).rcs;
        }


        if (configObject && configObject.exclude) {
            rcs.selectorLibrary.setExclude(configObject.exclude);
        }
    }; // /includeConfig
};
