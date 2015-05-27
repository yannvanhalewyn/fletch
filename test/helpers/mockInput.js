(function() {

  var mockInput = function(responses) {
    var stdin = require('mock-stdin').stdin();
    var k = 0;
    function sendAnswer() {
      setTimeout(function () {
        var text = responses[k];
        if (typeof text !== 'string') {
          throw new Error('Should give only text responses ' + JSON.stringify(responses, null, 2));
        }
        stdin.send(text + '\n');
        k += 1;
        if (k < responses.length) sendAnswer();
      }, 0);
    }
    sendAnswer();
  }

  module.exports = mockInput;
}())
