#!/usr/bin/env node

//! CHECK LIB.DEVDEPENDENCIES
var crawler  = require('./libcrawler')
var readline = require('readline')

var argument = /handlebars/i;

/*
 * This is a helper function to prompt a user.
 * It recurses until the format matches, then passes
 * on the reply
 */
function promptUser(format, callback) {
  var rl = readline.createInterface(process.stdin, process.stdout);
  rl.prompt();

  rl.on('line', function(line) {
    if (line == "exit") process.exit(0);
    if (line.match(format)) {
      rl.close();
      callback(line);
    } else {
      rl.prompt();
    }
  });
}


/*
 * The main function
 */
crawler.find(argument, function(packages) {
  // No matches
  if (packages.length == 0) {
    console.log("No matches found");
  }

  // Multiple matches
  else if (packages.length > 1) {

    // Log options
    console.log("Found many packages! Which one do you want?");
    for (var i in packages) {
      console.log(i + " - " + packages[i].name + "\t⇒\t" + packages[i].description);
    }

    // Get user's choice
    promptUser(/^[0-9]*$/, function(line) {
      var choice = parseInt(line);
      if (choice < packages.length) {
        console.log(crawler.extract(packages[choice]));
      } else {
        console.log("Not an options!");
      }
    });
  }

  // Only the one match
  else {
    console.log(crawler.extract(packages[0]));
  }
});
var cdn = "http://cdnjs.cloudflare.com/ajax/libs/{{name}}/{{version}}/{{filename}}"
