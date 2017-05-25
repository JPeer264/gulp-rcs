'use strict';

const rcs      = require('rcs-core');
const path     = require('path');
const json     = require('json-extra');
const merge    = require('lodash.merge');
const gutil    = require('gulp-util');
const gmatch   = require('gulp-match');
const through  = require('through2');
const includes = require('array-includes');

const rcsExport = options => {
    const optionsDefault = {
        css: ['.css', '.sass', '.scss'],
        mappingOrigValues: true,
        replaceKeyframes: false
    };

    options = options || {};
    options = merge(optionsDefault, options);

    options.css = typeof options.css === 'string' ? [ options.css ] : options.css;

    loadMapping(options.mapping, options.mappingOrigValues);

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

        if (options.config !== false) {
            includeConfig(options.config);
        }

        rcs.selectorLibrary.setExclude(options.exclude);

        if (includes(options.css, path.extname(file.relative))) {
            replaceFunction = rcs.replace.bufferCss;
        }

        // if file is excluded
        if (gmatch(file, options.excludeFile)) {
            this.push(file);

            return cb();
        }

        // calling the replace function from rcs-core
        data = replaceFunction(file.contents, {
            replaceKeyframes: options.replaceKeyframes,
            prefix: options.prefix,
            suffix: options.suffix,
            preventRandomName: options.preventRandomName,
        });

        file.contents = data;

        this.push(file);

        cb();
    });

    function loadMapping(mappingPath, origValues) {
        let selectors = mappingPath;

        if (typeof mappingPath === 'string') {
            selectors = json.readToObjSync(mappingPath, 'utf8');
        }

        if (!origValues) {
            let tempSelectors = {};

            for (let key in selectors) {
                let value = selectors[key];
                let modKey = key.slice(1, key.length);

                tempSelectors[key.charAt(0) + value] = modKey;
            }

            selectors = tempSelectors;
        }

        if (!selectors || typeof selectors !== 'object') {
            return;
        }

        rcs.selectorLibrary.setValues(selectors);
    } // /loadMapping

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

// rcsExport.loadMapping = require('./lib/loadMapping');
rcsExport.writeMapping = require('./lib/writeMapping');

module.exports = rcsExport;
