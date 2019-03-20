require('./tasks/start');
require('./tasks/build');
require('gulp').task('default', ['start'], () => {});