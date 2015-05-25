#!/usr/bin/env node

var crawler = require('./libcrawler')

var argument = /bootstrap/i;
crawler.find(argument, function(packages) {
  if (packages.length == 0) {
    console.log("No matches found");
  } else if (packages.length > 1) {
    console.log("Found many packages! Which one do you want?");
    for (var i in packages) {
      console.log(i + " - " + packages[i].name + "\t⇒\t" + packages[i].description);
    }
  }
});
var cdn = "http://cdnjs.cloudflare.com/ajax/libs/{{name}}/{{version}}/{{filename}}"
