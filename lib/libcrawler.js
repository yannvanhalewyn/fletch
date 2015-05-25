(function() {
  var fs = require('fs');
  var colog = require('colog');
  var Q = require('q');
  var fs_readFile = Q.denodeify(fs.readFile);

  var Crawler = {

    /*
     * The storage file containing CDNJS's package.json file
     */
    cache: 'cache/pckg.json',

    /*
     * This function lazily loads in the packages. If not cached, it returns
     * a promise to deliver the data. Else it simply returns the data.
     */
    getRawLibrary: function() {
      // Need to store 'this' in order to access it in the promise callback
      var that = this;
      if (!this.rawLibrary) {
        return fs_readFile(this.cache)
        .then(function (data) {
          that.rawLibrary = JSON.parse(data).packages;
          return that.rawLibrary;
        });
      } else {
        return this.rawLibrary;
      }
    },

    /*
     * Finds the single library entry whose name matches the string
     * exactly. Returns nothing if none found, returns a promise for
     * em if found
     */
    findMatching: function(string) {

    },

    /*
     * Finds all library entries whose name match the given regex
     * returns a promise
     */
    findByRegex: function(regex) {
    },

    /*
     * This method finds all package entries in the json data
     * And returns them as a promise for an array.
     */
    find: function(regex) {
      return this.getRawLibrary().then(function(rawLibrary) {
        var results = [];
        for (var i in rawLibrary) {
          lib = rawLibrary[i];
          if (lib.name.match(regex)) {
            results.push(lib);
          }
        }
        return results;
      })
    },

    /*
     * This function finds all dependent packages of a given one
     */
    grabDependencies: function(lib) {
      var deps = Object.keys(lib.dependencies);
      var results = [];

      var promises = [];
      for (var i in deps) {

        deps[i]
      }

      // A little recursive nodeling to handle the callback maddness
      // var that = this;
      // function findDep(i) {
      //   if (i == deps.length) return;
      //   var depName = deps[i];
      //   console.log("Looking for " + depName);
      //   that.getRawLibrary( function(packages) {
      //     console.log('test');
      //     var maybePile = [];
      //     var found;
      //     for (var j in packages) {
      //       lib = packages[j];
      //       // Found a matching one
      //       if (lib.name == depName) {
      //         console.log("FOUND!!");
      //         found = lib;
      //         break;
      //       }
      //       // Store a maybe pile just in case none is found
      //       // Ex: Dependency might state 'underscore', but the
      //       // lib is called 'underscore.js'
      //       if (lib.name.match(depName)) {
      //         maybePile.push(lib);
      //       }
      //     }
      //     if (found) {
      //       results.push(found);
      //     } else {
      //       colog.warning("CONFLICT: I found multiple libs mathing: " + depName);
      //       for (var opt in maybePile) {
      //         console.log(opt + "\t" + maybePile[opt].name);
      //       }
      //       promptUser(/(^[0-9]*$|\w)/, function(answer) {
      //         answer = parseInt(answer);
      //         if (parseInt(answer) != NaN && parseInt(answer) < maybePile.length) {
      //           console.log("You chose for: ", maybePile[answer]);
      //         } else {
      //           console.log("Dependency ignored");
      //         }
      //       });
      //     }
      //     findDep(i+1);
      //   })
      // }
      // findDep(0);
    }
  }

  module.exports = Crawler;
}())
