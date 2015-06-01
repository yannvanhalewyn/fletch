#!/usr/bin/env node

// deps
var colog  = require('colog');
var Q      = require('q');
var argv   = require('yargs').argv;
// lib
var store  = require('./lib/store');
var dl     = require('./lib/downloader');
var prompt = require('./lib/prompt');

var app = {

  /*
   * Shows a help pane
   */
  showHelp: function(argv) {
    console.log("Usage: fletcher <packageName> [options]");
    console.log();
    console.log("Options:");
    console.log();
    console.log("-o, --options\tSpecify the ouput directory.");
    console.log("-v, --version\tSpecify a version (semver support)");
    console.log("-h, --help\tShow help page");
    console.log();
    console.log("Example usage:");
    console.log();
    console.log("fletcher jquery\t\t\t#Downloads latest version of jQuery");
    console.log("fletcher jquery -o lib/deps\t#Downloads latest version of jQuery to the lib/deps/ directory");
    console.log("fletcher jquery -v \"<2\"\t\t#Downloads a version of jQuery that's lower than 2.0.0");
  },

  /*
   * Storing args as app.properties
   */
  parseArgs: function(argv) {
    this.params = {
      query: argv._[0],
      showHelp: argv.h    || argv.help   || false,
      destination: argv.o || argv.output || "",
      version: argv.v     || argv.version
    }
  },

  /*
   * The main code entrypoint
   */
  run: function(argv) {

    this.parseArgs(argv);
    if (this.params.showHelp) {
      this.showHelp();
      return;
    } else if (!this.params.query) {
      console.log("You must give me something!");
      return;
    }

    // The main call to the store
    store.findMatching(this.params.query).then(function (results) {
      this.parseMatches(results);
    }.bind(this)).catch(colog.error);
  },

  /*
   * This guy takes in an array of package objects. If empty, it prints
   * out a message. If 1 packages, it executes the processRequest method
   * on it. If mutltiple, it prompts the user to make a choice, and then
   * execute process request on it.
   */
  parseMatches: function(matches) {

    // No matches
    if (matches.length == 0) console.log("No matches found for " + this.params.query);

    // Multiple matches
    else if (matches.length > 1){
      // Log options
      colog.warning("Found many packages! Which one do you want?");
      var itemNames = matches.map(function(item) { return item.name });
      return prompt.options(itemNames).then(function(ans) {
        this.processRequest(matches[ans]);
      }.bind(this)).catch(console.error);
    }

    // Single match
    else this.processRequest(matches[0]);
  },

  /*
   * This function finishes the process by launching the dependency
   * checker and the download.
   */
  processRequest: function(lib) {
    colog.info("Will install " + lib.name);
    store.getDependentPackages(lib)
    .then(function(dependentPackages) {
      dl.download(lib, this.params.version, this.params.destination);
      dependentPackages.forEach( function(dependency) {
        dl.download(dependency, dependency.version, this.params.destination);
      }.bind(this));
    }.bind(this)).catch(console.error);
  }
}

module.exports = app;

if (require.main == module) {
  app.run(argv);
}
