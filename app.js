#!/usr/bin/env node

// Lib
var colog   = require('colog');
var Q       = require('q');
var rl      = require('readline-sync');
var crawler = require('./lib/libcrawler');
var dl      = require('./lib/libdownloader');


var argument = /ember/i;

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
  var libraries = crawler.grabDependencies(lib).concat(lib);
  console.log(libraries);
  libraries.forEach( function(library) {
    dl.download(library);
  })
}

/*
 * The main function
 */
crawler.find(argument).then(function (results) {

  // No matches
  if (results.length == 0) {
    console.log("No matches found");
  }

  // Multiple matches
  else if (results.length > 1){
    // Log options
    console.log("Found many packages! Which one do you want?");
    ans = promptOptions(results.map(function(item) { return item.name }));
    if (ans.match(/\w+/) && parseInt(ans) < results.length) {
      processRequest(results[ans]);
    } else {
      console.log("kaka!");
    }
  } else {
    processRequest(results[0]);
  }
});
