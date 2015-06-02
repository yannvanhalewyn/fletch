// Lib
var store           = require('../lib/store.js');
var prompt          = require('../lib/prompt');
// Deps
var Q               = require('q');
var chai            = require('chai');
var sinon           = require('sinon');
var sinonChai       = require('sinon-chai');
var expect          = chai.expect;
chai.use(sinonChai);
//Fixtures
var dummyJquery     = require('./helpers/fixtures').dummyJquery();
var dummyEmber      = require('./helpers/fixtures').dummyEmber();
var dummyEmberFire  = require('./helpers/fixtures').dummyEmberFire();
var dummyUnderscore = require('./helpers/fixtures').dummyUnderscore();


/*
 * Setup fake cdnjs request
 */
var fakeRequest = function(url) {
  var resBody = {results: []};
  if (url.match(/jquery/i)) resBody = {results: [dummyJquery]};
  if (url.match(/underscore/i)) resBody = {results: [dummyUnderscore]};
  if (url.match(/ember/i)) resBody = {results: [ dummyEmber,
                                                 dummyEmberFire] };
  var res = ["200 ok", JSON.stringify(resBody)];
  return Q(res);
}
before(function() {
  sinon.stub(store, "_call", fakeRequest);
});
after(function() {
  store._call.restore();
})


describe ('Store', function() {

  describe ('.findCollection()', function() {

    it('returns a promise for lib objects', function() {
      var promise = store.findCollection('jquery');
      return promise.then( function(collection) {
        var package = collection[0];
        expect(package.name).to.equal("jquery");
      });
    });

    it('includes dependencies in the dls', function() {
      var promise = store.findCollection('ember');
      return promise.then( function(collection) {
        var ember = collection[0];
        expect(ember.dependencies).to.have.a.property("underscore");
      });
    });

  });

  describe('.findMatching()', function() {

    it('returns only one library', function() {
      var promise = store.findMatching("jquery");
      return promise.then( function(matches) {
        expect(matches.length).to.eql(1);
      });
    });

    it('returns empty array if no match', function() {
      var promise = store.findMatching("nothingwillmatchthis");
      return promise.then( function(matches) {
        expect(matches.length).to.eq(0);
      });
    });

    it('returns multiple if no exact match', function() {
      var promise = store.findMatching("ember");
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
      var promise = store.getDependentPackages(dummyEmber);
      return promise.then( function(found) {
        expect(found.length).to.eql(2);
        expect(found[0].name).to.equal("jquery");
        expect(found[1].name).to.equal("underscore.js");
      });
    });

    it('returns an empty array if no dependent packages', function() {
      return store.getDependentPackages(dummyJquery).then(function(res) {
        expect(res).to.be.empty;
      });
    });

    it('asks the user if there are dependencies', function() {
      return store.getDependentPackages(dummyEmber).then(function(res) {
        expect(prompt.YN).to.have.been.calledWith("Would you like to install them?");
      });
    })

    it('doesn\'t ask shit if no dependencies', function() {
      return store.getDependentPackages(dummyJquery).then(function(res) {
        expect(prompt.YN).to.not.have.been.called;
      });
    });

    it('sets the packages version to the one specified by the dependency', function() {
      return store.getDependentPackages(dummyEmber).then(function(res) {
        expect(res[0].version).to.equal("3.2.1");
        expect(res[1].version).to.equal("1.2.3");
      });
    })

  });

});
