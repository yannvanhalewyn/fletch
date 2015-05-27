(function() {

  var Q = require('q');
  var readline = require('readline');

  /*
   * Displays a prompt and returns a promise that will resolve to
   * the user input
   */
  var _prompt = function() {
    var deferred = Q.defer();
    var rl = readline.createInterface(process.stdin, process.stdout);

    rl.prompt();
    rl.on('line', function(line) {
      rl.close();
      deferred.resolve(line);
    });
    return deferred.promise;
  };

  /*
   * Displays a prompt, and redisplays a prompt until response matches
   * the format. This returns a promise that resolves to that answer
   */
  var _promptUntilMatch = function(regex) {
    return (function loop(answer) {
      if (regex.test(answer)) return answer;
      else {
        return _prompt().then(loop);
      }
    }(""));
  }

  var prompt = {

    /*
     * Queries a question. Returns a boolean based on the answer,
     * redisplays a prompt if user input is invalid
     */
    YN: function(question) {
      console.log(question);
      return _promptUntilMatch(/(y|n)/i).then(function(res) {
        return /y/i.test(res);
      })
    },

    /*
     * Queries user to pick from a bunch of options
     */
    options: function(options) {
      for (var i in options) {
        console.log(i + " - " + options[i]);
      }
      return _promptUntilMatch(/[0-9]+/).then(function(res) {
        return parseInt(res);
      });
    }

  }

  module.exports = prompt;

}());
