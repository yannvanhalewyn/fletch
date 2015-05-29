var expect = require('chai').expect;
var sinon  = require('sinon');

var app    = require('../app');
var store  = require('../lib/store');
var dl     = require('../lib/libdownloader');

describe('CLI', function() {

  describe('arguments', function() {

    it('stores the requested package name', function() {
      app.run({_: ["ember"]});
      expect(app.query).to.equal("ember");
    });

    it('stores the output dir', function() {
      app.run({_: [], o: "lib/deps"});
      expect(app.outputDir).to.equal("lib/deps");
    })

  });

});

