'use strict';

const fs      = require('fs');
const rcs     = require('../');
const path    = require('path');
const gutil   = require('gulp-util');
const expect  = require('chai').expect;
const rcsCore = require('rcs-core');

const testFiles = './test/files';
const temp      = testFiles + '/tmp';
const results   = testFiles + '/results';
const fixtures  = testFiles + '/fixtures';

describe('writeMapping', () => {
    let newFile;

    beforeEach(done => {
        const beforeStream = rcs();

        newFile = new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/style.css',
            contents: fs.readFileSync(fixtures + '/style.css')
        });

        // reset counter and selectors for tests
        rcsCore.selectorLibrary.excludes            = [];
        rcsCore.selectorLibrary.selectors           = {};
        rcsCore.selectorLibrary.compressedSelectors = {};
        rcsCore.nameGenerator.resetCountForTests();

        beforeStream.on('data', () => {});

        beforeStream.on('end', done);

        beforeStream.write(newFile);

        beforeStream.end();
    });

    it('should write the mapping into an specific folder', done => {
        const stream = rcs.writeMapping('test');

        let filesCounter = 0;

        stream.on('data', file => {
            const contents = file.contents.toString();
            const filename = path.basename(file.path);

            filesCounter += 1;

            expect(contents).to.equal(fs.readFileSync(results + '/' + filename, 'utf8'));
        });

        stream.on('end', () => {
            expect(filesCounter).to.equal(2);

            done();
        });

        stream.write(newFile);

        stream.end();
    });

    it('should write the mapping min into an specific folder', done => {
        const stream = rcs.writeMapping('test', {
            cssMapping: false,
            cssMappingMin: true
        });

        let filesCounter = 0;

        stream.on('data', file => {
            const contents = file.contents.toString();
            const filename = path.basename(file.path);

            filesCounter += 1;

            expect(contents).to.equal(fs.readFileSync(results + '/' + filename, 'utf8'));
        });

        stream.on('end', () => {
            expect(filesCounter).to.equal(2);

            done();
        });

        stream.write(newFile);

        stream.end();
    });

    it('should write both mappings into an specific folder', done => {
        const stream = rcs.writeMapping('test', {
            cssMapping: true,
            cssMappingMin: true
        });

        let filesCounter = 0;

        stream.on('data', file => {
            const contents = file.contents.toString();
            const filename = path.basename(file.path);

            filesCounter += 1;

            expect(contents).to.equal(fs.readFileSync(results + '/' + filename, 'utf8'));
        });

        stream.on('end', () => {
            expect(filesCounter).to.equal(3);

            done();
        });

        stream.write(newFile);

        stream.end();
    });
});
