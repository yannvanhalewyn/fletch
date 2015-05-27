var prompt = require('../lib/prompt');
var mockInput = require('./helpers/mockInput')
var expect = require('chai').expect;

describe('Prompt', function() {

  describe('.YN()', function() {

    it('returns true if user pressed Y', function() {
      mockInput("y");
      return prompt.YN("Some Question").then( function(response) {
        expect(response).to.be.true;
      })
    });

    it('returns false if user pressed N', function() {
      mockInput("n");
      return prompt.YN("Some Question").then( function(response) {
        expect(response).to.be.false;
      })
    });

  });

  describe('.options()', function() {

    it('returns an option', function() {
      mockInput("2");
      return prompt.options(["option", "option"])
        .then(function(res) {
          expect(res).to.eql(2);
        })
    });
  });
});
