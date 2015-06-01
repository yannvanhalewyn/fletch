(function() {
  'use strict';

  var fs     = require('fs');
  var colog  = require('colog');
  var Q      = require('q');
  var rl     = require('readline');
  var request = require('request');
  var prompt = require('./prompt');

  /*
   * The main exported object
   */
  var store = {

    /*
     * A promise returning version of request();
     */
    _call: Q.denodeify(request),

    /*
     * This function returns the url to CDNJS's ai for searching for a
     * specific package
     */
    _buildUrl: function(name) {
      var url = "http://api.cdnjs.com/libraries?search={{name}}&fields=version,description,assets,dependencies";
      return url.replace("{{name}}", name);
    },

    /*
     * This method calls the cdnjs api with a search request
     */
    findCollection: function(query) {
      var url = this._buildUrl(query);
      return this._call(url).then( function(res) {
        var data = res[1]; // res[0] is the header
        return JSON.parse(data).results;
      }).catch(function(err) {
        colog.error("Could not connect to the CDNJS API");
      });
    },

    /*
     * This method tries to find a library whose name matces the string
     * to the letter. Always returns an array of packages, empty if none,
     * with single entry if one found, with multiple if conflict.
     */
    findMatching: function(query) {
      return this.findCollection(query)
      .then( function(matches) {
        if (matches.length > 1) {
          for (var i in matches) {
            if (matches[i].name == query) {
              return [matches[i]];
            }
          }
        }
        return matches;
      });
    },

    /*
     * This function finds all dependent packages of the given
     * This function is crazy complex because of the promise system
     * and many possible outcomes. If anyone reads this and thinks:
     * "Huh, that can be done better", please let me know!
     */
    getDependentPackages: function(lib) {
      if (!lib.dependencies) return Q([]);
      var depNames = Object.keys(lib.dependencies);
      colog.warning("This library has dependencies.");
      console.log("=>\t" + depNames.toString());

      var promise = prompt.YN("Would you like to install them?")
      .then(function(choice) {
        if (!choice) return [];
        var dependentPackages = [];
        // Loop over all elements in deps, chaining promises
        // to eachother. CRAZY shizzle :)
        return depNames.reduce(function(previousPromise, depName) {
          return previousPromise.then(function() {
            return store.findMatching(depName).then(function(matches) {
              if (matches.length == 1) {
                matches[0].version = lib.dependencies[depName];
                dependentPackages.push(matches[0]);
              }
              else {
                var conflictNames = matches.map(function(i) { return i.name });
                colog.warning("Found conflicting packages for " + depName);
                return prompt.options(conflictNames).then(function(ans) {
                  matches[ans].version = lib.dependencies[depName];
                  dependentPackages.push(matches[ans]);
                });
              }
            });
          });
        }, Q())
        .then(function() {
          return dependentPackages;
        });
      });

      return promise;
    }
  }

  module.exports = store;

}())


