var link = require('../lib/helpers/link');
var expect = require('chai').expect;

describe('link', function() {

  var lib = {

  }

  describe('.scriptTag()', function() {
    it('gives the correct script tag', function() {
      var tag = link.HTML("jquery", "2.1.4", "jquery.min.js");
      expect(tag).to.equal('<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>');
    });
  }); // End of .scriptTag();

  describe('.file()', function() {
    it('returns the correct url', function() {
      var url = link.toFile("jquery", "2.1.4", "jquery.min.js");
      expect(url).to.equal('http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js');
    });
  });

  describe('.search()', function() {
    it('returns a api request url for finding a certain pkg', function() {
      var url = link.apiSearch("jquery");
      expect(url).to.equal("http://api.cdnjs.com/libraries?search=jquery&fields=version,description,assets,dependencies");
    });
  });

});
