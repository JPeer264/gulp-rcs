const fs   = require('fs-extra');
const rcs  = require('../');
const path = require('path');
const gulp = require('gulp');

const testFiles = './test/files';
const fixtures = testFiles + '/fixtures';
const temp = testFiles + '/tmp';

describe('gulp-rcs', () => {
    after(() => {
        fs.removeSync(temp);
    });

    it('should rename files', () => {
        gulp.src([fixtures + '/**/*.css', fixtures + '/**/*.*'])
            .pipe(rcs())
            .pipe(gulp.dest(temp));

        // @todo set expect tests here
    });
});
