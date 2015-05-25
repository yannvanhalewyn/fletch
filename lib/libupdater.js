var fs = require('fs');
var request = require('request');

var packageURL = "http://cdnjs.com/packages.json";
var cacheFile = "/Users/yannvanhalewyn/Documents/code/javascript/nodejs/pulldown/cache/pckg.json";

request(packageURL, function(err, res, data) {
  if (err) throw err;
  fs.writeFile(cacheFile, data, function(err) {
    if (err) throw err;
  });
});
