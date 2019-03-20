const childProcess = require('child_process');
const electron = require('electron');
const gulp = require('gulp');

function start() {
    childProcess.spawn(electron, ['.'], {
        stdio: 'inherit'
    })
    .on('close', function () {
        process.exit();
    });
}

gulp.task('start', function () {
    start()
});

if(process.argv.indexOf('--execute') >= 0) {
    start();
}
