#!/usr/bin/env node

// deps
var colog  = require('colog');
var Q      = require('q');
var argv   = require('yargs').argv;
// lib
var store  = require('./lib/store');
var dl     = require('./lib/libdownloader');
var prompt = require('./lib/prompt');

var app = {

  /*
   * Storing args as app.properties
   */
  parseArgs: function(argv) {
    this.query     = argv._[0];
    this.outputDir = argv.o || "";
  },

  /*
   * The main code entrypoint
   */
  run: function(argv) {

    this.parseArgs(argv);
    if (!this.query) {
      console.log("You must give me something!");
      return;
    }

    // The main call to the store
    store.findMatching(this.query).then(function (results) {
      app.parseMatches(results);
    }).catch(function(err) {
      colog.error(err);
    });
  },

  /*
   * This guy takes in an array of package objects. If empty, it prints
   * out a message. If 1 packages, it executes the processRequest method
   * on it. If mutltiple, it prompts the user to make a choice, and then
   * execute process request on it.
   */
  parseMatches: function(matches) {

    // No matches
    if (matches.length == 0) console.log("No matches found");

    // Multiple matches
    else if (matches.length > 1){
      // Log options
      colog.warning("Found many packages! Which one do you want?");
      var itemNames = matches.map(function(item) { return item.name });
      return prompt.options(itemNames).then(function(ans) {
        app.processRequest(matches[ans]);
      }).catch(colog.error);
    }

    // Single match
    else app.processRequest(matches[0]);
  },

  /*
   * This function finishes the process by launching the dependency
   * checker and the download.
   */
  processRequest: function(lib) {
    colog.info("Will install " + lib.name);
    store.getDependentPackages(lib)
    .then(function(dependentPackages) {
      dl.download(lib);
      dependentPackages.forEach( function(library) {
        dl.download(library);
      })
    })
  }
}

module.exports = app;

if (require.main == module) {
  app.run(argv);
}
