'use strict';

const rcs   = require('rcs-core');
const json  = require('json-extra');
const merge = require('lodash.merge');

const loadMapping = (mappingPath, options) => {
    let selectors = mappingPath;

    const optionsDefault = {
        origValues: true
    };

    options = options || {};
    options = merge(optionsDefault, options);

    if (typeof mappingPath === 'string') {
        selectors = json.readToObjSync(mappingPath, 'utf8');
    }

    if (!options.origValues) {
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
};

module.exports = loadMapping;
