(function(){
  var fs      = require('fs');
  var path    = require('path');
  var request = require('request');
  var colog   = require('colog');
  var mkdirp  = require('mkdirp');
  var semver  = require('semver');
  var link    = require('./helpers/link');
  var extract = require('./helpers/extract');

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
      return link.toFile(this.name, this.version, this.file);
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
      // Pipe data to writeStream if 200 OK
      var stream = request.get(this.url());
      stream.on("error", console.error);
      stream.on('response', function(res) {
        if (res.statusCode == 200) {
          this.makeDirs();
          stream.pipe(fs.createWriteStream(this.outputPath()));
          colog.setProgressDescription(this.file + " ");
          colog.progress(1, null, null, "DL");
        } else {
          console.error(res.statusCode + " " + res.statusMessage + " - " + this.file);
        }
      }.bind(this));
    }
  }

  var downloader = {

    /*
     * This function downloads the one file marked as 'latest' by
     * CDNJS
     */
    _downloadMainFile: function(lib, version, destination) {
      var fileName = lib.latest.split('/').slice(-1)[0];
      var download = new Download(lib.name, version, fileName, destination);
      download.execute();
    },

    /*
     * This function handles the download of a signle lib
     */
    download: function(lib, version, destination, minimal) {
      var version = version || lib.version;
      var asset = extract.asset(lib, version);
      if (minimal) {
        colog.progress(0, 1);
        this._downloadMainFile(lib, asset.version, destination);
        return;
      }
      colog.progress(0, asset.files.length);
      asset.files.forEach(function(file) {
        var download = new Download(lib.name, asset.version, file.name, destination);
        download.execute();
      })
    },

  }
  module.exports = downloader;
}())
