(function(){
  var fs = require('fs');
  var request = require('request');

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
      var url = "http://cdnjs.cloudflare.com/ajax/libs/{{name}}/{{version}}/{{filename}}"
      url = url.replace("{{name}}", this.name);
      url = url.replace("{{version}}", this.version);
      url = url.replace("{{filename}}", this.file);
      return url;
    }

    /*
     * This function concatinates an absolute path to store the file
     */
    this.outputPath = function() {
      return fs.realpathSync(this.dir) + "/" + this.file;
    }

    /*
     * This is the main functionality, it downloads the file
     */
    this.execute = function() {
      console.log("Downloading " + this.file);
      var that = this;
      request(this.url(), function(err, res, data) {
        if (err)  console.error(err);
        fs.writeFile(that.outputPath(), data, function(err) {
          if (err) console.error(err);
          console.log("Download success! " + that.file);
        });
      });
    }
  }

  var downloader = {
    cdn: "http://cdnjs.cloudflare.com/ajax/libs/{{name}}/{{version}}/{{filename}}",
    targetDir: "./",

    /*
     * This function takes in a lib object and extracts all necessary files
     * from it
     */
    extract: function(lib, version) {
      files = [];
      lib.assets.forEach( function(asset) {
        if (asset.version == version) {
          files = asset.files.map( function(file) { return file.name} );
        }
      });
      return files;
    },

    /*
     * This function handles the download of a signle lib
     */
    download: function(lib, version) {
      var version = version || lib.version;
      var files = this.extract(lib, version);
      files.forEach(function(file) {
        console.log(file);
        var download = new Download(lib.name, version, file, "tests");
        download.execute();
      })
    },

  }
  module.exports = downloader;
}())
