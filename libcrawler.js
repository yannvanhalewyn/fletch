(function() {
  var fs = require('fs');

  var Crawler = {

    /*
     * The storage file containing CDNJS's package.json file
     */
    cache: 'tmp.json',

    /*
     * This method finds all package entries in the json data
     * And returns them as array.
     */
    find: function(regex, callback) {
      fs.readFile(this.cache, function(err, data) {
        if (err) {
          console.log("Could not read " + this.cache);
          return;
        }
        var packages = JSON.parse(data).packages;
        var results = [];
        for (var i in packages) {
          lib = packages[i];
          if (lib.name.match(regex)) {
            results.push(lib);
          }
        }
        callback(results);
      });
    },

    /*
     * This function finds all dependencies and hands back shit
     */

  }

  module.exports = Crawler;
}())


// function parseLib(lib, files) {
//   var version = lib.version;
//   for (var i in files) {
//     var url = cdn.replace("{{name}}", lib.name);
//     url = url.replace("{{version}}", version);
//     url = url.replace("{{filename}}", files[i].name);
//     console.log(url);
//   }
// }

//
// fs.readFile('cache/pckg.json', function(err, data) {
//   var packages = JSON.parse(data).packages;
//   var results = [];
//   for (var i in packages) {
//     lib = packages[i];
//     if (lib.name.match(argument)) {
//       results.push(lib);
//       var assets = [];
//       for (var i in lib.assets) {
//         if (lib.assets[i].version == lib.version) {
//           assets = lib.assets[i];
//           break;
//         }
//       }
//       parseLib(lib, assets.files);
//       break;
//     }
//   }
//   for (var i in results) {
//     console.log(results[i].name);
//   }
// });
