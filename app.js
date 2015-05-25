var fs = require('fs');

var argument = /^bootstrap/i;
var cdn = "http://cdnjs.cloudflare.com/ajax/libs/{{name}}/{{version}}/{{filename}}"

function parseLib(lib, files) {
  var version = lib.version;
  for (var i in files) {
    var url = cdn.replace("{{name}}", lib.name);
    url = url.replace("{{version}}", version);
    url = url.replace("{{filename}}", files[i].name);
    console.log(url);
  }
}
fs.readFile('cache/pckg.json', function(err, data) {
  var packages = JSON.parse(data).packages;
  var found = [];
  for (var i in packages) {
    lib = packages[i];
    if (lib.name.match(argument)) {
      found = true;
      console.log(lib);
      var assets = [];
      for (var i in lib.assets) {
        if (lib.assets[i].version == lib.version) {
          assets = lib.assets[i];
          break;
        }
      }
      parseLib(lib, assets.files);
      break;
    }
  }
  if (!found) {
    console.log("Not found");
  }
});
