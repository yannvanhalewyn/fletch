(function(){
  var fs = require('fs');
  var request = require('request');
  var colog = require('colog');

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
      if (!fs.existsSync(this.dir)) {
        fs.mkdirSync(this.dir);
      }
      return fs.realpathSync(this.dir) + "/" + this.file;
    }

    /*
     * This is the main functionality, it downloads the file
     */
    this.execute = function() {
      console.log("Downloading " + this.file);
      var that = this;
      // Execute HTTP request
      request(this.url(), function(err, res, data) {
        if (err)  console.error(err);
        // Write the result to disk
        fs.writeFile(that.outputPath(), data, function(err) {
          if (err) {
            colog.error(err);
            process.exit(1);
          }
          colog.success("Download success! " + that.file);
          colog.progress(1);
        });
      });
    }
  }

  var downloader = {

    /*
     * This function takes in a lib object and extracts all necessary files
     * from it
     */
    extract: function(lib, version) {
      files = [];
      lib.assets.forEach( function(asset) {
        console.log("each " + asset.version + version);
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
      colog.progress(0, files.length);
      files.forEach(function(file) {
        console.log(file);
        var download = new Download(lib.name, version, file, "tests");
        download.execute();
      })
    },

  }
  module.exports = downloader;
}())
