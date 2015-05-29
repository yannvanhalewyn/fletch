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

    beforeEach(function() {
      sinon.stub(process, "nextTick").yields();
      sinon.stub(store, "getDependentPackages").returns(Q([]));
    });

    afterEach(function() {
      process.nextTick.restore();
      store.getDependentPackages.restore();
    });

    it('asks store to find a match for query', function() {
      app.run({_: ["jquery"]});
      expect(store.findMatching.calledWith("jquery")).to.be.true;
    });

    it('asks store to check for dependencies', function() {
      sinon.stub(prompt, "options").returns(Q(0));
      app.run({_: ["ember"]});
      expect(store.getDependentPackages.called).to.be.true;
      prompt.options.restore();
    });

  });

  describe('prompt', function() {

    beforeEach(function() {
      sinon.stub(process, "nextTick").yields();
      sinon.stub(prompt, "YN").returns(Q(false));
      sinon.stub(prompt, "options").returns(Q(0));
    });

    afterEach(function() {
      process.nextTick.restore();
      prompt.options.restore();
      prompt.YN.restore();
    });

    it('prompts user when multiple found', function() {
      app.run({_: ["ember"]});
      expect(prompt.options.called).to.be.true;
    });

    it('prompts the user if he wants to install dependencies', function() {
      app.run({_: ["ember"]});
      expect(prompt.YN.calledWith("Would you like to install them?")).to.be.true;
    });

  });

});

