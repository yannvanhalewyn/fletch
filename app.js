#!/usr/bin/env node
// http://api.cdnjs.com/libraries?search=jquery&fields=version,description,assets,dependencies

// Lib
var colog  = require('colog');
var Q      = require('q');
var store  = require('./lib/store');
var dl     = require('./lib/libdownloader');
var prompt = require('./lib/prompt');


var argument = "reacti";

/*
 * This is a helper function to prompt a user.
 * It loops until the format matches, then passes
 * on the reply
 */
global.promptOptions = function(options) {
  for (var opt in options) {
    console.log(opt + "\t" + options[opt]);
  }
  colog.info("Hit 'n' for nothing.");
  do {
    var ans = rl.prompt();
  } while(!ans.match(/(^[0-9]+|n)/i));
  return ans;
}

/*
 * This function finishes the process by launching the dependency checker
 * and the download.
 */
function processRequest(lib) {
  colog.info("Will install " + lib.name);
  store.getDependentPackages(lib)
  .then(function(dependentPackages) {
    dl.download(lib);
    dependentPackages.forEach( function(library) {
      dl.download(library);
    })
  })
}

/*
 * The main function
 */
store.findMatching(argument).then(function (results) {

  // No matches
  if (results.length == 0) {
    console.log("No matches found");
  }

  // Multiple matches
  else if (results.length > 1){
    // Log options
    colog.warning("Found many packages! Which one do you want?");
    return prompt.options(results.map(function(item) { return item.name }))
    .then(function(ans) {
      processRequest(results[ans]);
    }).catch(colog.error);
  }

  // Single match
  else {
    processRequest(results[0]);
  }
}).catch(function(err) {
  colog.error(err);
});
