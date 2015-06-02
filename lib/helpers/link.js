(function() {

  var link = {

    _host: function(pkgName, version, filename) {
      var url = "//cdnjs.cloudflare.com/ajax/libs/{{name}}/" +
                "{{version}}/{{filename}}";
      return url.replace("{{name}}", pkgName)
                .replace("{{version}}", version)
                .replace("{{filename}}", filename);
    },

    HTML: function(pkgName, version, filename) {
      var tag;
      if (/.css$/.test(filename)) {
        tag = '<link rel="stylesheet" href="{{url}}">';
      } else if (/.js$/.test(filename)) {
        tag = '<script type="text/javascript" src="{{url}}"></script>';
      } else return;
      return tag.replace("{{url}}", this._host(pkgName, version, filename));
    },

    toFile: function(pkgName, version, filename) {
      return "http:" + this._host(pkgName, version, filename);
    },

    apiSearch: function(name) {
      var url = "http://api.cdnjs.com/libraries?search={{name}}" +
                "&fields=version,description,assets,dependencies";
      return url.replace("{{name}}", name);
    }

  };

  module.exports = link;

}())
