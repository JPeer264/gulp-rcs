const fs     = require('fs-extra');
const rcs    = require('../');
const rcsCore = require('rcs-core');
const path   = require('path');
const gulp   = require('gulp');
const expect = require('chai').expect;
const assert = require('stream-assert');
const is = require('funsert');

const testFiles = './test/files';
const temp      = testFiles + '/tmp';
const results   = testFiles + '/results';
const fixtures  = testFiles + '/fixtures';

describe('gulp-rcs', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcsCore.selectorLibrary.selectors           = {};
        rcsCore.selectorLibrary.compressedSelectors = {};
        rcsCore.selectorLibrary.excludes            = [];
        rcsCore.nameGenerator.resetCountForTests();
    });

    after(() => {
        fs.removeSync(temp);
    });

    it('should rename files', done => {
        gulp.src([fixtures + '/style.css', fixtures + '/main.txt', fixtures + '/index.html'])
            .pipe(rcs())
            .pipe(gulp.dest(temp))
            .pipe(assert.end(done))
    });
});
