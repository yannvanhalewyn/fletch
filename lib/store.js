(function() {
  'use strict';

  var fs      = require('fs');
  var colog   = require('colog');
  var Q       = require('q');
  var call    = Q.denodeify(require('request'));

  var Crawler = {

    /*
     * This function returns the url to CDNJS's ai for searching for a
     * specific package
     */
    buildUrl: function(name) {
      var url = "http://api.cdnjs.com/libraries?search={{name}}&fields=version,description,assets,dependencies";
      return url.replace("{{name}}", name);
    },

    /*
     * This method calls the cdnjs api with a search request
     */
    findCollection: function(query) {
      var url = this.buildUrl(query);
      return call(url).then( function(res) {
        var data = res[1];
        return JSON.parse(data).results;
      });
    },

    /*
     * This method tries to find a library whose name matces the string
     * to the letter.
     */
    findMatching: function(query) {
      return this.findCollection(query)
      .then( function(matches) {
        // Return nothing if no match, return the single match if match
        if (matches.length == 0) return;
        if (matches.length == 1) return matches[0];
        else {
          for (var i in matches) {
            if (matches[i].name == query) {
              return matches[i];
            }
          }
        }
        // Just return all of them if multiple match
        return matches;
      });
    },

    /*
     * This function finds all dependent packages of the given
     */
    grabDependencies: function(lib) {
      // Check for dependencies
      if (!lib.dependencies) return [];
      var deps = Object.keys(lib.dependencies);

      colog.warning("This library has dependencies.");
      console.log("=>\t" + deps.toString());
      var ans = rl.keyInYN("Would you like to download them?");
      if (!ans) return [];
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
