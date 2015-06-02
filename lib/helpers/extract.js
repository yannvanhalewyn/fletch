(function() {

  var colog  = require('colog');
  var semver = require('semver');

  var extract = {

    asset: function(lib, version) {
      files = [];
      for (var i in lib.assets) {
        var asset = lib.assets[i];
        if (!semver.valid(asset.version)) continue;
        if (semver.satisfies(asset.version, version)) {
          return asset;
        }
      }
      // Version not found
      var versions = lib.assets.map(function(a) { return a.version});
      colog.warning("Could not find " + lib.name + " version " + version);
      console.log(". Maybe you wanted one of " + versions.toString());
      throw new Error("Version not found");
    }
  };

  module.exports = extract;

}())
