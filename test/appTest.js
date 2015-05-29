var expect    = require('chai').expect;
var sinon     = require('sinon');
var Q         = require('q');

var prompt    = require('../lib/prompt');
var app       = require('../app');
var store     = require('../lib/store');
var dl        = require('../lib/libdownloader');

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
      expect(app.query).to.equal("ember");
    });

    it('stores the output dir', function() {
      app.run({_: [], o: "lib/deps"});
      expect(app.outputDir).to.equal("lib/deps");
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
      sinon.stub(prompt, "YN").returns(Q(false));
      sinon.stub(prompt, "options").returns(Q(0));
    });

    afterEach(function() {
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

    it('doesn\'t prompt the user if no deps', function() {
      app.run({_: ["jquery"]});
      expect(prompt.YN.calledWith("Would you like to install them?")).to.be.false;
    });

  });

  describe('dispatch to downloader', function() {

    beforeEach(function() {
      sinon.stub(dl, "download");
    });

    afterEach(function() {
      dl.download.restore();
    });

    it('dispatches to downloader', function() {
      app.run({_: ["jquery"]});
      expect(dl.download.calledWith(dummyJquery)).to.be.true;
      expect(dl.download.calledOnce).to.be.true;
    });

    it('dispatches downloads for dependencies', function() {
      sinon.stub(prompt, "options").returns(Q(0));
      sinon.stub(prompt, "YN").returns(Q(true));
      app.run({_: ["ember"]});
      expect(dl.download.calledWith(dummyJquery)).to.be.true;
      expect(dl.download.calledWith(dummyUnderscore)).to.be.true;
      prompt.YN.restore();
      prompt.options.restore();
    });

    it('passes on the outputDir', function() {
      app.run({_: ["jquery"], o: "lib/deps"});
      // expect(dl.download.calledWith(dummyJquery)).to.be.true;
      expect(dl.download.calledWith(dummyJquery, null, "lib/deps")).to.be.true;
    });

    it('passes on output dir on dependency dl dispatch', function() {
      sinon.stub(prompt, "options").returns(Q(0));
      sinon.stub(prompt, "YN").returns(Q(true));
      app.run({_: ["ember"], o: "lib/deps"});
      expect(dl.download.calledWith(dummyJquery, null, "lib/deps")).to.be.true;
      expect(dl.download.calledWith(dummyUnderscore, null, "lib/deps")).to.be.true;
      prompt.YN.restore();
      prompt.options.restore();
    })

  });

});

