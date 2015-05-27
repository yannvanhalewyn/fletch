(function() {

  var mockInput = function(response) {
    if (typeof response !== 'string') {
      throw new Error('Expected text response, but got ' + response);
    }
    var stdin = require('mock-stdin').stdin();
    process.nextTick(function mockResponse() {
      stdin.send(response + '\n');
    });
  }

  module.exports = mockInput;
}())
