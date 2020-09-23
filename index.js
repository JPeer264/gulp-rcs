'use strict';

const rcs      = require('rcs-core');
const path     = require('path');
const json     = require('json-extra');
const merge    = require('lodash.merge');
const gmatch   = require('gulp-match');
const through  = require('through2');
const includes = require('array-includes');
const PluginError = require('plugin-error');

const rcsExport = options => {
    const optionsDefault = {
        js: ['.js', '.jsx'],
        css: ['.css', '.sass', '.scss'],
        html: ['.html', '.html'],
        pug: ['.pug', '.jade'],
        mappingOrigValues: true,
        replaceKeyframes: false,
        ignoreAttributeSelectors: false,
    };

    options = options || {};
    options = merge(optionsDefault, options);

    options.css = typeof options.css === 'string' ? [ options.css ] : options.css;

    loadMapping(options.mapping, options.mappingOrigValues);

    return through.obj(function (file, enc, cb) {
        let data;
        let newFile;
        let replaceFunction = rcs.replace.any;

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            cb(new PluginError('gulp-rcs', 'Streaming not supported'));
            return;
        }

        if (options.config !== false) {
            includeConfig(options.config);
        }

        rcs.selectorsLibrary.setExclude(options.exclude);

        if (includes(options.css, path.extname(file.relative))) {
            rcs.fillLibraries(file.contents.toString(), {
                replaceKeyframes: options.replaceKeyframes,
                prefix: options.prefix,
                suffix: options.suffix,
                ignoreAttributeSelectors: options.ignoreAttributeSelectors,
                preventRandomName: options.preventRandomName,
            })

            replaceFunction = rcs.replace.css;
        }

        if (includes(options.html, path.extname(file.relative))) {
            replaceFunction = rcs.replace.html;
        }

        if (includes(options.pug, path.extname(file.relative))) {
            replaceFunction = rcs.replace.pug;
        }

        if (includes(options.js, path.extname(file.relative))) {
            replaceFunction = rcs.replace.js;
        }

        // if file is excluded
        if (gmatch(file, options.excludeFile)) {
            this.push(file);

            return cb();
        }

        // calling the replace function from rcs-core
        data = replaceFunction(file.contents.toString());

        file.contents = new Buffer(data);

        this.push(file);

        cb();
    });

    function loadMapping(mappingPath, origValues) {
        let selectors = mappingPath;

        if (typeof mappingPath === 'string') {
            selectors = json.readToObjSync(mappingPath, 'utf8');
        }

        if (!selectors || typeof selectors !== 'object') {
            return;
        }

        rcs.mapping.load(selectors, { origValues })
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
            rcs.selectorsLibrary.setExclude(configObject.exclude);
        }
    }; // /includeConfig
};

// rcsExport.loadMapping = require('./lib/loadMapping');
rcsExport.writeMapping = require('./lib/writeMapping');

module.exports = rcsExport;
