// Custom code
var Q         = require('q');
var store     = require('../lib/store.js');
var prompt    = require('../lib/prompt');

// Npm test packages
var chai      = require('chai');
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
var expect    = chai.expect;
chai.use(sinonChai);


/*
 * Setup fake cdnjs request
 */
var fakeRequest = function(url) {
  var react = { name: "react", dependencies: null };
  var reactiveCoffee = {
    name: "reactive-coffee",
    dependencies: {
      underscore: "3.2.1",
      jquery: "1.2.3"
    }
  }
  var underscore_js = { name: "underscore.js", dependencies: null }
  var underscore_contrib = { name: "underscore.contrib", dependencies: null }
  var requestedPackages = {results: []};
  if (url.match(/react/)) requestedPackages = {results: [react, reactiveCoffee]};
  if (url.match(/reactive-coffee/)) requestedPackages = {results: [reactiveCoffee]};
  if (url.match(/underscore/)) requestedPackages = {
    results: [ underscore_js, underscore_contrib]
  };

  var res = ["200 ok", JSON.stringify(requestedPackages)];
  return Q(res);
}
sinon.stub(store, "_call", fakeRequest);


describe ('Store', function() {

  describe ('.findCollection()', function() {

    it('returns a promise for lib objects', function() {
      var promise = store.findCollection('react');
      return promise.then( function(collection) {
        var package = collection[0];
        expect(package.name).to.equal("react");
      });
    });

    it('includes dependencies in the dls', function() {
      var promise = store.findCollection('reactive-coffee');
      return promise.then( function(collection) {
        var reactCoffee = collection[0];
        expect(reactCoffee.dependencies).to.have.a.property("underscore");
      });
    });

  });

  describe('.findMatching()', function() {

    it('returns only one library', function() {
      var promise = store.findMatching("react");
      return promise.then( function(matches) {
        expect(matches.length).to.eql(1);
        expect(matches[0].name).to.equal("react");
      });
    });

    it('returns empty array if no match', function() {
      var promise = store.findMatching("nothingwillmatchthis");
      return promise.then( function(matches) {
        expect(matches.length).to.eq(0);
      });
    });

    it('returns multiple if no exact match', function() {
      var promise = store.findMatching("underscore");
      return promise.then( function(matches) {
        expect(matches.length).to.be.above(1);
      });
    });

  });

  describe ('.getDependentPackages()', function() {

    beforeEach(function() {
      sinon.stub(prompt, "YN").returns(Q(true));
      sinon.stub(prompt, "options").returns(Q(0));
    });

    afterEach(function() {
      prompt.YN.restore();
      prompt.options.restore();
    });

    it('returns an array of dependent packages', function() {
      var lib = { name: "react-coffee",
                  dependencies: { react: "3.2.1", underscore: "2.1.1" } };
      var promise = store.getDependentPackages(lib);
      return promise.then( function(found) {
        expect(found.length).to.eql(2);
        expect(found[0].name).to.equal("react");
        expect(found[1].name).to.equal("underscore.js");
      });
    });

    it('returns an empty array if no dependent packages', function() {
      var lib = { name: "underscore.js", dependencies: null };
      return store.getDependentPackages(lib).then(function(res) {
        expect(res).to.be.empty;
      });
    });

    it('asks the user if there are dependencies', function() {
      var lib = { name: "react-coffee",
        dependencies: { react: "3.2.1", underscore: "2.1.1" } };
      return store.getDependentPackages(lib).then(function(res) {
        expect(prompt.YN).to.have.been.calledWith("Would you like to install them?");
      });
    })

    it('doesn\'t ask shit if no dependencies', function() {
      var lib = { name: "react-coffee", dependencies: null };
      return store.getDependentPackages(lib).then(function(res) {
        expect(prompt.YN).to.not.have.been.called;
      });
    });

    it('sets the packages version to the one specified by the dependency', function() {
      var lib = { name: "react-coffee",
        dependencies: { react: "3.2.1", underscore: "2.1.1" } };
      return store.getDependentPackages(lib).then(function(res) {
        expect(res[0].version).to.equal("3.2.1");
        expect(res[1].version).to.equal("2.1.1");
      });
    })

  });

});
