var expect = require('chai').expect;
var store = require('../lib/store.js');

describe ('Store', function() {

  describe ('.buildUrl()', function() {
    it('returns the correct cdnjs api url', function() {
      var url = store.buildUrl("jquery");
      expect(url).to.equal("http://api.cdnjs.com/libraries?search=jquery&fields=version,description,assets,dependencies");
    });
  });
  describe ('.findCollection()', function() {

    it('returns a promise of lib objects', function() {
      // var promise = store.findCollection('twitter-bootstrap');
      // return promise.then( function(collection) {
      //   var package = collection[1];
      //   expect(package.name).to.equal("twitter-bootstrap");
      // })
    });

    it('includes dependencies in the dls', function() {
      var promise = store.findCollection('react');
      return promise.then( function(collection) {
        var reactCoffee = collection[6];
        expect(reactCoffee.dependencies).to.have.a.property("underscore");
      })
    });

  });

});
