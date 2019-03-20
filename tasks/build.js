const gulp = require('gulp');
const packager = require('electron-packager');
const path = require('path');
const baseDir = path.dirname(__dirname);
const info = require('../package');

function build() {
  let options = {
    dir: baseDir,
    name: info.config.name,
    version: info.version,
    'app-version': info.name,
    'build-version': info.config['build-version'],
    'app-bundle-id': info.config['app-bundle-id'],
    arch: process.arch,
    platform: process.platform,
    overwrite: true,
    asar: false,
    ignore: [
      path.join(baseDir, '.git'),
      path.join(baseDir, 'build'),
      path.join(baseDir, 'config'),
      path.join(baseDir, 'resources'),
      __dirname,
      path.join(baseDir, '.DS_Store'),
      path.join(baseDir, '.gitignore'),
      path.join(baseDir, 'gulpfile.js'),
      path.join(baseDir, 'README.md')
    ],
    out: path.join(baseDir, 'build')
  };

  packager(options, (err, appPaths) => {
    if (err) {
      console.error('Ops, An error ocurred in the build', err);
    } else {
      console.log('Build finished', appPaths);
    }
  });
}

gulp.task('build', function () {
  build();
});

if(process.argv.indexOf('--execute') >= 0) {
  build();
}