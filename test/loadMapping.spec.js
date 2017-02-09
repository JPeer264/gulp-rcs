const fs      = require('fs-extra');
const rcs     = require('../');
const path    = require('path');
const gutil   = require('gulp-util');
const expect  = require('chai').expect;
const rcsCore = require('rcs-core');

describe.skip('loadMapping', () => {
    it('should load mappings correctly', done => {
        const stream = rcs();

        rcs.loadMapping();

        stream.on('data', () => {});

        stream.on('end', () => {
            // @todo write expects
            done();
        });

        stream.end();
    });
});
