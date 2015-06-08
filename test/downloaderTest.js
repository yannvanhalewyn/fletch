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

// var EventEmitter = require('events').EventEmitter;
var PassThrough = require('stream').PassThrough;

// Shut up colog
colog.silent(true);

describe('downloader', function() {

  // Setup file system stubs, httprequest stubs
  beforeEach(function() {
    mock_fs();
    // sinon.stub(request, "get").yields(null, {statusCode: 200}, 'someData');
    this.responseStream = new PassThrough();
    this.responseStream.write('RESPONSE DATA');
    sinon.stub(request, "get").returns(this.responseStream);
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
                          "libs/jquery/4.4.4/latest.js"
        expect(request.get).to.have.been.calledWith(expectedUrl);
        expect(request.get).to.have.been.calledOnce;
      });

      it("semver compatibly when minimal option is giving", function() {
        dl.download(dummyJquery, "<4", "", true);
        var expectedUrl = "http://cdnjs.cloudflare.com/ajax/" +
                          "libs/jquery/3.3.3/latest.js"
        expect(request.get).to.have.been.calledWith(expectedUrl);
        expect(request.get).to.have.been.calledOnce;
      });

    }); // End of calls api.CDNJS

    describe('interacts with the file system', function() {

      describe('on#response', function() {

        context('200 OK', function() {

          it('saves all files to disk', function() {
            dl.download(dummyJquery, undefined, "");
            this.responseStream.emit('response', {statusCode: 200});
            var expected = ["file1-4.4.4.js", "file2-4.4.4.js"];
            expect(fs.readdirSync("")).to.eql(expected);
          });

          it('creates dirs if necessary', function() {
            dl.download(dummyJquery, "4.1.1", "");
            this.responseStream.emit('response', {statusCode: 200});
            expect(fs.readdirSync("")).to.eql(["css", "js"]);
            expect(fs.readdirSync("js")).to.eql(["file1-4.1.1.js"]);
            expect(fs.readdirSync("css")).to.eql(["file2-4.1.1.js"]);
          });

          it('creates all files in specified output dir', function() {
            dl.download(dummyJquery, undefined, "someDir");
            this.responseStream.emit('response', {statusCode: 200});
            expect(fs.readdirSync("")).to.eql(["someDir"]);
            var expected = ["file1-4.4.4.js", "file2-4.4.4.js"];
            expect(fs.readdirSync("someDir")).to.eql(expected);
          });

          it('creates all folders recursively', function() {
            dl.download(dummyJquery, "4.1.1", "someDir");
            this.responseStream.emit('response', {statusCode: 200});
            expect(fs.readdirSync("")).to.eql(["someDir"]);
            var expected = ["css", "js"];
            expect(fs.readdirSync("someDir")).to.eql(expected);
          });

          it('saves the one file to disk when minimal is specified', function() {
            dl.download(dummyJquery, "4.1.1", "", true);
            this.responseStream.emit('response', {statusCode: 200});
            expect(fs.readdirSync("")).to.eql(["latest.js"]);
          });

        }); // End of 200 OK

        context('404 NOT FOUND', function() {

          before(function() {
            sinon.stub(console, "error");
          });
          after(function() {
            console.error.restore();
          });

          it('doesn\'t create the files', function() {
            dl.download(dummyJquery, "4.1.1", "");
            this.responseStream.emit('response', {statusCode: 404});
            expect(fs.readdirSync("")).to.be.empty;
          });

          it('doesn\'t create the given outputDir', function() {
            dl.download(dummyJquery, "", "someDir");
            this.responseStream.emit('response', {statusCode: 404});
            expect(fs.existsSync("someDir")).to.be.false;
          });

          it('doesn\'t create dirs for the downloaded files', function() {
            dl.download(dummyJquery, "4.1.1", "");
            this.responseStream.emit('response', {statusCode: 404});
            expect(fs.readdirSync("")).to.not.eql(["css", "js"]);
          });

          it('prints out the error', function() {
            dl.download(dummyJquery, "4.1.1", "");
            this.responseStream.emit('response', {statusCode: 404,
                                                  statusMessage: "not found"});
            var expectedErr1 = "404 not found - js/file1-4.1.1.js";
            var expectedErr2 = "404 not found - css/file2-4.1.1.js";
            expect(console.error).to.have.been.calledWith(expectedErr1);
            expect(console.error).to.have.been.calledWith(expectedErr2);
          });

        });

      }); // End of on#response

      describe("on#error", function() {

        it('doesn\'t create the files', function() {
          dl.download(dummyJquery, "4.1.1", "");
          this.responseStream.emit('error');
          expect(fs.readdirSync("")).to.be.empty;
        });

        it('doesn\'t create the given outputDir', function() {
          dl.download(dummyJquery, "", "someDir");
          this.responseStream.emit('error');
          expect(fs.existsSync("someDir")).to.be.false;
        });

        it('doesn\'t create dirs for the downloaded files', function() {
          dl.download(dummyJquery, "4.1.1", "");
          this.responseStream.emit('error');
          expect(fs.readdirSync("")).to.not.eql(["css", "js"]);
        });

        it('prints out the error', function() {
          sinon.stub(console, "error");
          dl.download(dummyJquery, "4.1.1", "");
          this.responseStream.emit('error', "ERRORMESSAGE");
          expect(console.error).to.have.been.calledWith("ERRORMESSAGE");
          console.error.restore();
        });

      }); // End of on#error

    }); // End of interacts with the file system

  }); // End of .download()

}); // End of downloader
