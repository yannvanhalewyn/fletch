// Deps
var Q         = require('q');
var chai      = require('chai');
var expect    = chai.expect;
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
// Lib
var prompt    = require('../lib/prompt');
var app       = require('../app');
var store     = require('../lib/store');
var dl        = require('../lib/downloader');
//Fixtures
var dummyJquery = require('./helpers/fixtures').dummyJquery();
var dummyEmber = require('./helpers/fixtures').dummyEmber();
var dummyEmberFire = require('./helpers/fixtures').dummyEmberFire();
var dummyUnderscore = require('./helpers/fixtures').dummyUnderscore();

describe('CLI', function() {

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

  describe('.parseArgs()', function() {

    // Don't clutter stdout with help messages
    before(function() {
      sinon.stub(app, "showHelp");
    });
    after(function() {
      app.showHelp.restore();
    });

    it('has the correct defaults', function() {
      app.run({_: []});
      var expected = {
        query: undefined,
        showHelp: false,
        destination: "",
        version: undefined,
        silent: false,
        minimal: false,
        printHTML: false
      };
      expect(app.params).to.eql(expected);
    });

    it('stores the requested package name', function() {
      app.run({_: ["ember"]});
      expect(app.params.query).to.equal("ember");
    });

    it('stores -o as destination', function() {
      app.run({_: [], o: "lib/deps"});
      expect(app.params.destination).to.equal("lib/deps");
    });

    it('stores -v as version', function() {
      app.run({_: [], v: "<=2.1.1"});
      expect(app.params.version).to.equal("<=2.1.1");
    });

    it('stores -m as minimal', function() {
      app.run({_: [], m: true});
      expect(app.params.minimal).to.be.true;
    })

    it('stores -h as showHelp', function() {
      app.run({_: [], h: true});
      expect(app.params.showHelp).to.be.true;
    });

    it('stores -s as silent', function() {
      app.run({_: [], s: true});
      expect(app.params.silent).to.be.true;
    });

    it('stores -t as printHTML', function() {
      app.run({_: [], t: true});
      expect(app.params.printHTML).to.be.true;
    });

    it('understands --output', function() {
      app.run({_: [], output: "lib/deps"});
      expect(app.params.destination).to.equal("lib/deps");
    });

    it('understands --version', function() {
      app.run({_: [], version: "<=2.1.1"});
      expect(app.params.version).to.equal("<=2.1.1");
    });

    it('understands --help', function() {
      app.run({_: [], help: true});
      expect(app.params.showHelp).to.be.true;
    });

    it('understands --silent', function() {
      app.run({_: [], silent: true});
      expect(app.params.silent).to.be.true;
    });

    it('understands --minimal', function() {
      app.run({_: [], minimal: true});
      expect(app.params.minimal).to.be.true;
    });

    it('understands --tag', function() {
      app.run({_: [], tag: true});
      expect(app.params.printHTML).to.be.true;
    });

    it('calls the help page', function() {
      app.run({_: [], help: true});
      expect(app.showHelp).to.have.been.called;
    });

    it('sets colog to silent mode', function() {
      var colog = require('colog');
      sinon.spy(colog, "silent");
      app.run({_: ["jquery"], silent: true});
      expect(colog.silent).to.have.been.calledWith(true);
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
      expect(dl.download).to.have.been.calledWith(dummyJquery, undefined, "lib/deps");
    });

    it('passes on output dir on dependency dl dispatch', function() {
      app.run({_: ["ember"], o: "lib/deps"});
      expect(dl.download).to.have.been.calledWithMatch(dummyJquery, "", "lib/deps");
      expect(dl.download).to.have.been.calledWithMatch(dummyUnderscore, "", "lib/deps");
    });

    it('passes on the version if any', function() {
      app.run({_: ["jquery"], v: "1.2.3"});
      expect(dl.download).to.have.been.calledWith(dummyJquery, "1.2.3");
    });

    it('passes on the correct versions of dependencies', function() {
      app.run({_: ["ember"]});
      expect(dl.download).to.have.been.calledWith(dummyUnderscore, "1.2.3");
      expect(dl.download).to.have.been.calledWith(dummyJquery, "3.2.1");
    });

    it('passes on true if minimal flag is set', function() {
      app.run({_: ["jquery"], m: true});
      expect(dl.download).to.have.been.calledWith(dummyJquery, undefined, "", true);
    });

    it('it passes on the minimal flag to deps downloads', function() {
      app.run({_: ["ember"], m: true});
      expect(dl.download).to.have.been.calledWith(dummyUnderscore, "1.2.3", "", true);
      expect(dl.download).to.have.been.calledWith(dummyJquery, "3.2.1", "", true);
    });

  }); // End of dispatch to download

  describe('--tag', function() {


    function expectTagPrintedFor(pkgName, version, filename) {
      var genericTag = '<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/{{name}}/{{version}}/{{filename}}"></script>';
      var tag = genericTag.replace("{{name}}", pkgName)
                          .replace("{{version}}", version)
                          .replace("{{filename}}", filename);
      expect(console.log).to.have.been.calledWith(tag);
    }

    beforeEach(function() {
      sinon.spy(console, "log");
    });
    afterEach(function() {
      console.log.restore();
    });

    it("doesn't execute a download", function() {
      sinon.stub(dl, "download");
      app.run({_: ["jquery"], t: true});
      expect(dl.download).to.not.have.been.called;
      dl.download.restore();
    });

    it("prints out script tags", function() {
      app.run({_: ["jquery"], t: true});
      expectTagPrintedFor("jquery", "4.4.4", "file1-4.4.4.js");
      expectTagPrintedFor("jquery", "4.4.4", "file2-4.4.4.js");
    });

    it("spits out a single tag for the latest file with -m", function() {
      app.run({_: ["jquery"], t: true, m: true});
      expectTagPrintedFor("jquery", "4.4.4", "latest.js");
    });

    it("spits out script tags with correct version", function() {
      app.run({_: ["jquery"], t: true, v: "<4"});
      expectTagPrintedFor("jquery", "3.3.3", "file1-3.3.3.js");
      expectTagPrintedFor("jquery", "3.3.3", "file2-3.3.3.js");
    });

    it("spits out the correct versionned script tag with -m", function() {
      app.run({_: ["jquery"], t: true, v: "<4", m: true});
      expectTagPrintedFor("jquery", "3.3.3", "latest.js");
    });

  });

});

