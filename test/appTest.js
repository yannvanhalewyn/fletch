var Q         = require('q');
var chai      = require('chai');
var expect    = chai.expect;
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var prompt    = require('../lib/prompt');
var app       = require('../app');
var store     = require('../lib/store');
var dl        = require('../lib/downloader');

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
    // This is so my stubbers execute immediately, and I can run
    // assertions (like called, calledWith, etc..) against them
    // immediately
    sinon.stub(process, "nextTick").yields();
  });

  afterEach(function() {
    store.findMatching.restore();
    process.nextTick.restore();
  });

  describe('arguments', function() {

    it('stores the requested package name', function() {
      app.run({_: ["ember"]});
      expect(app.params.query).to.equal("ember");
    });

    it('stores the output dir', function() {
      app.run({_: [], o: "lib/deps"});
      expect(app.params.destination).to.equal("lib/deps");
    });

  });

  describe('dispatch to store', function() {

    beforeEach(function() {
      sinon.stub(store, "getDependentPackages").returns(Q([]));
    });

    afterEach(function() {
      store.getDependentPackages.restore();
    });

    it('asks store to find a match for query', function() {
      app.run({_: ["jquery"]});
      expect(store.findMatching).to.have.been.calledWith("jquery");
    });

    it('asks store to check for dependencies', function() {
      sinon.stub(prompt, "options").returns(Q(0));
      app.run({_: ["ember"]});
      expect(store.getDependentPackages).to.have.been.called;
      prompt.options.restore();
    });

  });

  describe('prompt', function() {

    beforeEach(function() {
      sinon.stub(prompt, "YN").returns(Q(false));
      sinon.stub(prompt, "options").returns(Q(0));
    });

    afterEach(function() {
      prompt.options.restore();
      prompt.YN.restore();
    });

    it('prompts user when multiple found', function() {
      app.run({_: ["ember"]});
      expect(prompt.options).to.have.been.called;
    });

  });

  describe('dispatch to downloader', function() {

    beforeEach(function() {
      sinon.stub(prompt, "options").returns(Q(0));
      sinon.stub(prompt, "YN").returns(Q(true));
      sinon.stub(dl, "download");
    });

    afterEach(function() {
      dl.download.restore();
      prompt.YN.restore();
      prompt.options.restore();
    });

    it('dispatches to downloader', function() {
      app.run({_: ["jquery"]});
      expect(dl.download).to.have.been.calledWith(dummyJquery);
      expect(dl.download).to.have.been.calledOnce;
    });

    it('dispatches downloads for dependencies', function() {
      app.run({_: ["ember"]});
      expect(dl.download).to.have.been.calledWith(dummyJquery);
      expect(dl.download).to.have.been.calledWith(dummyUnderscore);
    });

    it('passes on the outputDir', function() {
      app.run({_: ["jquery"], o: "lib/deps"});
      expect(dl.download).to.have.been.calledWith(dummyJquery, null, "lib/deps");
    });

    it('passes on output dir on dependency dl dispatch', function() {
      app.run({_: ["ember"], o: "lib/deps"});
      expect(dl.download).to.have.been.calledWith(dummyJquery, null, "lib/deps");
      expect(dl.download).to.have.been.calledWith(dummyUnderscore, null, "lib/deps");
    });

  });

});

