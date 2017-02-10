const fs      = require('fs-extra');
const rcs     = require('../');
const path    = require('path');
const gutil   = require('gulp-util');
const expect  = require('chai').expect;
const rcsCore = require('rcs-core');

describe('loadMapping', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcsCore.selectorLibrary.excludes            = [];
        rcsCore.selectorLibrary.selectors           = {};
        rcsCore.selectorLibrary.compressedSelectors = {};
        rcsCore.nameGenerator.resetCountForTests();
    });

    it('should load the mappings file correctly', done => {
        const stream = rcs();

        rcs.loadMapping('./test/files/renaming_map.json');

        stream.on('data', () => {});

        stream.on('end', () => {
            expect(rcsCore.selectorLibrary.get('jp-block')).to.equal('a');
            expect(rcsCore.selectorLibrary.get('.jp-pseudo')).to.equal('e');

            done();
        });

        stream.end();
    });

    it('should load the mappings object correctly', done => {
        const stream = rcs();

        rcs.loadMapping({
            '.jp-block': 'a',
            '.jp-pseudo': 'e'
        });

        stream.on('data', () => {});

        stream.on('end', () => {
            expect(rcsCore.selectorLibrary.get('jp-block')).to.equal('a');
            expect(rcsCore.selectorLibrary.get('.jp-pseudo')).to.equal('e');

            done();
        });

        stream.end();
    });
});
