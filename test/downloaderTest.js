var mock_fs   = require('mock-fs');
var fs        = require('fs');
var colog     = require('colog');
var sinon     = require('sinon');
var chai      = require('chai');
var sinonChai = require('sinon-chai');
var request   = require('request');
var dl        = require('../lib/downloader');

// Setup sinonChar
chai.use(sinonChai);
var expect = chai.expect;

// Setup file system stubs, httprequest stubs
mock_fs();
sinon.stub(request, "get").yields(null, null, 'someData');

// Shut up colog
colog.silent(true);


describe ('downloader', function() {

  var dummyLib = {
    name: "jquery",
    version: "4.4.4",
    assets: [
      {
        version: "4.4.4",
        files: [
          { name: "file1-4.4.4.js" },
          { name: "file2-4.4.4.js" }
        ]
      },
      {
        version: "3.3.3",
        files: [
          { name: "file1-3.3.3.js" },
          { name: "file2-3.3.3.js" }
        ]
      }
    ]
  };


  describe ('.donwload()', function() {

    describe ('calls api.CDNJS', function() {

      var expectCallToCDNJS = function(name, version, file) {
        var url = "http://cdnjs.cloudflare.com/ajax/libs/" +
                  "{{name}}/{{version}}/{{filename}}"
        url = url.replace("{{name}}", name);
        url = url.replace("{{version}}", version);
        url = url.replace("{{filename}}", file);
        expect(request.get).to.have.been.calledWith(url);
      };

      it('for the latest version if none specified', function() {
        dl.download(dummyLib, undefined, "");
        expectCallToCDNJS("jquery", "4.4.4", "file1-4.4.4.js");
        expectCallToCDNJS("jquery", "4.4.4", "file2-4.4.4.js");
        expect(request.get).to.have.been.calledTwice;
      });

      it('for the specified version', function() {
        dl.download(dummyLib, "3.3.3", "");
        expectCallToCDNJS("jquery", "3.3.3", "file1-3.3.3.js");
        expectCallToCDNJS("jquery", "3.3.3", "file2-3.3.3.js");
      });

      it('with semver support', function() {
        dl.download(dummyLib, "<4", "");
        expectCallToCDNJS("jquery", "3.3.3", "file1-3.3.3.js");
        expectCallToCDNJS("jquery", "3.3.3", "file2-3.3.3.js");
      })

    });

  });
});
