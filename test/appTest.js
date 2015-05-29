var expect = require('chai').expect;
var sinon  = require('sinon');
var Q      = require('q');

var prompt = require('../lib/prompt');
var app    = require('../app');
var store  = require('../lib/store');
var dl     = require('../lib/libdownloader');
var mockInput = require('./helpers/mockInput');

describe('CLI', function() {

  var dummyJquery = {name: "jquery", version: "3.2.1"};
  var dummyEmber = {name: "ember.js", version: "3.2.1",
                    dependencies: {jquery: "1.2.3", underscore: "1.2.3"}};
  var dummyEmberFire = {name: "emberFire", version: "1.2.2"};
  var dummyUnderscore = {name: "underscore.js", version: "1.2.3"};

  beforeEach(function() {
    sinon.stub(store, "findMatching", function(query) {
      if (query == "jquery") return Q([dummyJquery]);
      else if (query == "ember") return Q([dummyEmber, dummyEmberFire]);
      else if (query == "underscore") return Q([dummyUnderscore]);
    });
  });

  afterEach(function() {
    store.findMatching.restore();
  });

  describe('arguments', function() {

    it('stores the requested package name', function() {
      app.run({_: ["ember"]});
      expect(app.query).to.equal("ember");
    });

    it('stores the output dir', function() {
      app.run({_: [], o: "lib/deps"});
      expect(app.outputDir).to.equal("lib/deps");
    });

  });

  describe('dispatch to store', function() {

    before(function() {
      sinon.stub(prompt, "options", function(options) { return Q(0) });
      sinon.stub(prompt, "YN", function(question) { return Q(false)});
      sinon.stub(store, "getDependentPackages", function(){return Q([])});
    });

    it('asks store to find a match for query', function() {
      app.run({_: ["jquery"]});
      expect(store.findMatching.calledWith("jquery")).to.be.true;
    });

    it('prompts user when multiple found', function() {
      app.run({_: ["ember"]});
      setTimeout(function() {
        expect(prompt.options.called).to.be.true;
      }, 0);
    });

    it('asks store to check for dependencies', function() {
      app.run({_: ["ember"]});
      console.log("Done");
      setTimeout(function() {
        expect(store.getDependentPackages.called).to.be.true;
      }, 0);
    });

  });

});

