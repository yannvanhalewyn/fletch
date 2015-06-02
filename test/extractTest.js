var extract  = require('../lib/helpers/extract');
var expect   = require('chai').expect;
var dummyLib = require('./helpers/fixtures').dummyLib;

describe('extract', function() {

  describe('.asset()', function() {

    it('returns an asset object of the correct version', function() {
      var asset = extract.asset(dummyLib, "4.1.1");
      expect(asset).to.eql({
        version: "4.1.1",
        files: [
          { name: "js/file1-4.1.1.js" },
          { name: "css/file2-4.1.1.js" }
        ]
      });
    });

    it('is returns the correct asset semver compatibly', function() {
      var asset = extract.asset(dummyLib, "<4");
      expect(asset).to.eql({
        version: "3.3.3",
        files: [
          { name: "file1-3.3.3.js" },
          { name: "file2-3.3.3.js" }
        ]
      });
    });

    it('throws an error if no version found', function() {
      var fn = extract.asset.bind(undefined, dummyLib, ">5");
      expect(fn).to.throw("Version not found");
    });

  });
});
