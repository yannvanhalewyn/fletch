var crawler = require('./lib/libcrawler.js');

// var packages = crawler.getRawLibrary();
// packages.then(function(data) {
//   console.log("returned");
//   console.log(data.length)
//   console.log(crawler.getRawLibrary().length);
// }, console.err);

// crawler.find(/react/).then(function (found) {
//   console.log(found);
// }, console.error);

// var findPromise = crawler.find(/react/);
// console.log(findPromise);
// findPromise.then(console.log, console.error);

// devDependencies:
//        { 'autoprefixer-core': '^5.0.0',
//        'coverjs-loader': '^0.5.0',
//               'css-loader': '^0.9.1',
//        deepmerge: '^0.2.7',
//        del: '^1.1.1',
//        express: '^4.11.0',
//        gulp: '^3.8.10',
//        'gulp-rimraf': '^0.1.1',
//        'gulp-ruby-sass': '^0.7.1',
//        jade: '^1.9.1',
//        jquery: '^2.1.3',
//        'jsx-loader': '^0.12.2',
//        karma: '^0.12.31',
//        'karma-chrome-launcher': '^0.1.7',
//        'karma-mocha': '^0.1.10',
//        'karma-webpack': '^1.5.0',
//        mocha: '^2.1.0',
//        'object-assign': '^2.0.0',
//        'postcss-loader': '^0.3.0',
//        'react-hot-loader': '^1.1.1',
//        'react-router': '^0.11.6',
//        'run-sequence': '^1.0.2',
//        'sass-loader': '^0.3.1',
//        sinon: '^1.12.2',
//        'style-loader': '^0.8.3',
//        webpack: '^1.5.1',
//        'webpack-dev-server': '^1.7.0'
// },


var libDeps = {
  dependencies :  {
    jquery : "3.2.1",
    underscore : "2.4.4",
    react: "kaka"
  }
};
// crawler.findMatching("jquery").then(console.log);
// crawler.getRawLibrary().then( function(data) {
//   return crawler.grabDependencies(libDeps);
// })
// .then(console.log, console.err);
// crawler.getRawLibrary().then( function(data) {
//   var deps = crawler.grabDependencies(libDeps);
//   deps = deps.map(function(dep) { return dep.name });
//   console.log("Got: " + deps);
// });

