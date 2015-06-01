(function(){
  var fs      = require('fs');
  var path    = require('path');
  var request = require('request');
  var colog   = require('colog');
  var mkdirp  = require('mkdirp');
  var semver  = require('semver');

  /*
   * This object represents a Download to be executed
   */
  var Download = function(name, version, file, targetDir) {

    this.dir = targetDir || "";
    this.name = name;
    this.version = version;
    this.file = file;

    /*
     * This function returns the cdnjs url for the download
     */
    this.url = function() {
      var url = "http://cdnjs.cloudflare.com/ajax/libs/" +
                "{{name}}/{{version}}/{{filename}}"
      url = url.replace("{{name}}", this.name);
      url = url.replace("{{version}}", this.version);
      url = url.replace("{{filename}}", this.file);
      return url;
    },

    /*
     * This function returns the path to store the file
     */
    this.outputPath = function() {
      return path.join(this.dir, this.file);
    },

    /*
     * Makes the directories needed
     */
    this.makeDirs = function() {
      var recDir = path.join(this.dir, path.dirname(this.file));
      if (!fs.existsSync(recDir)) mkdirp.sync(recDir);
    },

    /*
     * This is the main functionality, it downloads the file
     */
    this.execute = function() {
      this.makeDirs();
      // Execute HTTP request
      request.get(this.url(), function(err, res, data) {
        if (err)  console.error(err);
        // Write the result to disk
        fs.writeFile(this.outputPath(), data, function(err) {
          if (err) {
            colog.error(err);
            process.exit(1);
          }
          colog.success("Download success! " + this.outputPath());
          colog.progress(1);
        }.bind(this));
      }.bind(this));
    }
  }

  var downloader = {

    /*
     * This function extracts all necessary files from a lib
     */
    _extract: function(lib, version) {
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
     * This function handles the download of a signle lib
     */
    download: function(lib, version, destination) {
      var version = version || lib.version;
      var asset = this._extract(lib, version);
      colog.progress(0, asset.files.length);
      asset.files.forEach(function(file) {
        var download = new Download(lib.name, asset.version, file.name, destination);
        download.execute();
      })
    },

  }
  module.exports = downloader;
}())
