'use strict';

const fs      = require('fs-extra');
const rcs     = require('../');
const path    = require('path');
const gutil   = require('gulp-util');
const expect  = require('chai').expect;
const rcsCore = require('rcs-core');

const testFiles = './test/files';
const temp      = testFiles + '/tmp';
const results   = testFiles + '/results';
const fixtures  = testFiles + '/fixtures';

describe('gulp-rcs', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcsCore.selectorLibrary.excludes            = [];
        rcsCore.selectorLibrary.selectors           = {};
        rcsCore.selectorLibrary.compressedSelectors = {};
        rcsCore.nameGenerator.resetCountForTests();
    });

    it('should rename all files', done => {
        const stream = rcs();

        stream.on('data', file => {
            const contents = file.contents.toString();
            const filename = path.basename(file.path);

            expect(contents).to.equal(fs.readFileSync(results + '/' + filename, 'utf8'));
        });

        stream.on('end', done);

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/style.css',
            contents: fs.readFileSync(fixtures + '/style.css')
        }));

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/main.js',
            contents: fs.readFileSync(fixtures + '/main.js')
        }));

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/index.html',
            contents: fs.readFileSync(fixtures + '/index.html')
        }));

        stream.end();
    });

    it('should rename all files with prefixes', done => {
        const stream = rcs({
            prefix: 'prefixed-'
        });

        stream.on('data', file => {
            const contents = file.contents.toString();

            expect(contents).to.equal(fs.readFileSync(results + '/style-prefix.css', 'utf8'));
        });

        stream.on('end', done);

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/style.css',
            contents: fs.readFileSync(fixtures + '/style.css')
        }));

        stream.end();
    });

    it('should rename also the keyframes', done => {
        const string = `
            @keyframes  move {
                from: {} to: {}
            }

            .selector {
                animation: move 4s;
            }

            .another-selector {
                animation:     move     4s    ;
            }
        `;

        const expectedString = `
            @keyframes  a {
                from: {} to: {}
            }

            .b {
                animation: a 4s;
            }

            .c {
                animation:     a     4s    ;
            }
        `;
        const stream = rcs({
            replaceKeyframes: true
        });

        stream.on('data', file => {
            const contents = file.contents.toString();

            expect(contents).to.equal(expectedString);
        });

        stream.on('end', done);

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/style.css',
            contents: new Buffer(string)
        }));

        stream.end();

    });

    it('should exclude a specific file', done => {
        const stream = rcs({
            excludeFile: '**/ignore.js'
        });

        stream.on('data', file => {
            const contents = file.contents.toString();
            const filename = path.basename(file.path);

            expect(contents).to.equal(fs.readFileSync(results + '/' + filename, 'utf8'));
        });

        stream.on('end', done);

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/style.css',
            contents: fs.readFileSync(fixtures + '/style.css')
        }));

        stream.write(new gutil.File({
            cwd: __dirname,
            base: results,
            path: results + '/ignore.js',
            contents: fs.readFileSync(results + '/ignore.js')
        }));

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/main.js',
            contents: fs.readFileSync(fixtures + '/main.js')
        }));

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/index.html',
            contents: fs.readFileSync(fixtures + '/index.html')
        }));

        stream.end();
    });

    it('should exclude specific selectors', done => {
        const stream = rcs({
            exclude: [
                'js',
                'no-js'
            ]
        });

        stream.on('data', file => {
            const contents = file.contents.toString();
            const filename = path.basename(file.path);

            expect(contents).to.equal(fs.readFileSync(results + '/style-with-exclude.css', 'utf8'));
        });

        stream.on('end', done);

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/style.css',
            contents: fs.readFileSync(fixtures + '/style.css')
        }));

        stream.end();
    });

    it('should exclude specific selectors from config', done => {
        const stream = rcs({
            config: testFiles + '/config.json'
        });

        stream.on('data', file => {
            const contents = file.contents.toString();
            const filename = path.basename(file.path);

            expect(contents).to.equal(fs.readFileSync(results + '/style-with-exclude.css', 'utf8'));
        });

        stream.on('end', done);

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/style.css',
            contents: fs.readFileSync(fixtures + '/style.css')
        }));

        stream.end();
    });

    it('should fail, just scss files allowed', done => {
        // just scss files are allowed. Failed because just CSS files are loaded
        const stream = rcs({
            css: '.scss'
        });

        stream.on('data', file => {
            const contents = file.contents.toString();
            const filename = path.basename(file.path);

            expect(contents).to.not.equal(fs.readFileSync(results + '/' + filename, 'utf8'));
        });

        stream.on('end', done);

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/style.css',
            contents: fs.readFileSync(fixtures + '/style.css')
        }));

        stream.write(new gutil.File({
            cwd: __dirname,
            base: fixtures,
            path: fixtures + '/main.js',
            contents: fs.readFileSync(fixtures + '/main.js')
        }));

        stream.end();
    });

    describe('loadMapping', () => {
        beforeEach(() => {
            // reset counter and selectors for tests
            rcsCore.selectorLibrary.excludes            = [];
            rcsCore.selectorLibrary.selectors           = {};
            rcsCore.selectorLibrary.compressedSelectors = {};
            rcsCore.nameGenerator.resetCountForTests();
        });

        it('should load the mappings file correctly', done => {
            const stream = rcs({
                mapping: './test/files/results/renaming_map.json'
            });

            stream.on('data', () => {});

            stream.on('end', () => {
                expect(rcsCore.selectorLibrary.get('jp-block')).to.equal('a');
                expect(rcsCore.selectorLibrary.get('.jp-pseudo')).to.equal('e');

                done();
            });

            stream.end();
        });

        it('should load the mappings object correctly', done => {
            const stream = rcs({
                mapping: {
                    '.jp-block': 'a',
                    '.jp-pseudo': 'e'
                }
            });

            stream.on('data', () => {});

            stream.on('end', () => {
                expect(rcsCore.selectorLibrary.get('jp-block')).to.equal('a');
                expect(rcsCore.selectorLibrary.get('.jp-pseudo')).to.equal('e');

                done();
            });

            stream.end();
        });

        it('should load the mappings object correctly', done => {
            const stream = rcs({
                mapping: {
                    '.a': 'jp-block',
                    '.e': 'jp-pseudo'
                },
                mappingOrigValues: false
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
});
