// deps
var mock_fs     = require('mock-fs');
var fs          = require('fs');
var request     = require('request');
var colog       = require('colog');
var sinon       = require('sinon');
var chai        = require('chai');
var expect      = chai.expect;
var sinonChai   = require('sinon-chai');
chai.use(sinonChai);
// Lib
var dl          = require('../lib/downloader');
// Fixtures
var dummyJquery = require('./helpers/fixtures').dummyJquery();

// Shut up colog
colog.silent(true);

describe ('downloader', function() {

  // Setup file system stubs, httprequest stubs
  beforeEach(function() {
    mock_fs();
    sinon.stub(request, "get").yields(null, {statusCode: 200}, 'someData');
  });
  afterEach(function() {
    mock_fs.restore();
    request.get.restore();
  });

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
        dl.download(dummyJquery, undefined, "");
        expectCallToCDNJS("jquery", "4.4.4", "file1-4.4.4.js");
        expectCallToCDNJS("jquery", "4.4.4", "file2-4.4.4.js");
        expect(request.get).to.have.been.calledTwice;
      });

      it('for the specified version', function() {
        dl.download(dummyJquery, "3.3.3", "");
        expectCallToCDNJS("jquery", "3.3.3", "file1-3.3.3.js");
        expectCallToCDNJS("jquery", "3.3.3", "file2-3.3.3.js");
      });

      it('with semver support', function() {
        dl.download(dummyJquery, "<4", "");
        expectCallToCDNJS("jquery", "3.3.3", "file1-3.3.3.js");
        expectCallToCDNJS("jquery", "3.3.3", "file2-3.3.3.js");
      });

      it("doesn't call when no matching versions", function() {
        try { dl.download(dummyJquery, "<3", ""); } catch(err) {}
        expect(request.get).to.not.have.been.called;
      });

      it("with 'latest' file when minimal option is given", function() {
        dl.download(dummyJquery, "", "", true);
        var expectedUrl = "http://cdnjs.cloudflare.com/ajax/" +
                          "libs/jquery/4.4.4/file.js"
        expect(request.get).to.have.been.calledWith(expectedUrl);
        expect(request.get).to.have.been.calledOnce;
      });

      it("semver compatibly when minimal option is giving", function() {
        dl.download(dummyJquery, "<4", "", true);
        var expectedUrl = "http://cdnjs.cloudflare.com/ajax/" +
                          "libs/jquery/3.3.3/file.js"
        expect(request.get).to.have.been.calledWith(expectedUrl);
        expect(request.get).to.have.been.calledOnce;
      });

    }); // End of calls api.CDNJS

    describe('writes files to disk', function() {

      it('saves all files to disk', function() {
        dl.download(dummyJquery, undefined, "");
        var expected = ["file1-4.4.4.js", "file2-4.4.4.js"];
        expect(fs.readdirSync("")).to.eql(expected);
      });

      it('creates dirs if necessary', function() {
        dl.download(dummyJquery, "4.1.1", "");
        expect(fs.readdirSync("")).to.eql(["css", "js"]);
        expect(fs.readdirSync("js")).to.eql(["file1-4.1.1.js"]);
        expect(fs.readdirSync("css")).to.eql(["file2-4.1.1.js"]);
      });

      it('creates all files in specified output dir', function() {
        dl.download(dummyJquery, undefined, "someDir");
        expect(fs.readdirSync("")).to.eql(["someDir"]);
        var expected = ["file1-4.4.4.js", "file2-4.4.4.js"];
        expect(fs.readdirSync("someDir")).to.eql(expected);
      });

      it('creates all folders recursively', function() {
        dl.download(dummyJquery, "4.1.1", "someDir");
        expect(fs.readdirSync("")).to.eql(["someDir"]);
        var expected = ["css", "js"];
        expect(fs.readdirSync("someDir")).to.eql(expected);
      });

      it('saves the one file to disk when minimal is specified', function() {
        dl.download(dummyJquery, "4.1.1", "", true);
        expect(fs.readdirSync("")).to.eql(["file.js"]);
      })

    });

  });

});
