(function() {

  var colog  = require('colog');
  var semver = require('semver');

  var extract = {

    /*
     * returns an asset object containing the assets version, and an array
     * of file objects each having a name property
     */
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
    },

    /*
     * Iterates through the lib's assets to return a string representing
     * an asset version matching the semver version passed in. It throws
     * an error if none found
     */
    matchingVersion: function(lib, version) {
      return this.asset(lib, version).version;
    }

  };

  module.exports = extract;

}())
