(function() {
  'use strict';

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
          var lib = rawLibrary[i];
          if (lib.name.match(regex)) {
            results.push(lib);
          }
        }
        return results;
      })
    },

    /*
     * This function finds all dependent packages of the given
     */
    grabDependencies: function(lib) {
      // Check for dependencies
      if (!lib.dependencies) return [];
      else {
        colog.warning("This library has dependencies.");
        var ans = rl.keyInYN("Would you like to download them?");
        console.log(ans);
        if (!ans) return [];
      }

      var deps = Object.keys(lib.dependencies);
      var results = [];

      // Look for each of the deps
      for (var dep in deps) {
        var depname = deps[dep]
        var maybePile = [];
        var found = false;

        // Look through the store
        for (var j in this.rawLibrary) {
          var cursorLib = this.rawLibrary[j];

          // Exact match found
          if (cursorLib.name == depname) {
            results.push(cursorLib);
            found = true;
          }
          // A just in case list is kept (regex)
          else if (cursorLib.name.match(depname)) {
            maybePile.push(cursorLib);
          }
        }

        // Check if missing
        if (!found) {
          if (maybePile.length == 0) {
            colog.error("ERROR: Could not find files for " + depname);
          } else {
            colog.warning("CONFLICT: I found multiple libs mathing: " + depname);
            var options = maybePile.map( function(o) { return o.name} );
            var ans = promptOptions(options);
            if (ans.match(/\w+/) && parseInt(ans) < maybePile.length) {
              results.push(maybePile[ans]);
            }
          }
        }
      }
      return results;
    }
  }

  module.exports = Crawler;
}())
