(function() {

  var link = {

    HTML: function(pkgName, version, filename) {
      var tag = '<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/{{name}}/{{version}}/{{filename}}"></script>';
      tag = tag.replace("{{name}}", pkgName);
      tag = tag.replace("{{version}}", version);
      tag = tag.replace("{{filename}}", filename);
      return tag;
    },

    toFile: function(pkgName, version, filename) {
      var url = "http://cdnjs.cloudflare.com/ajax/libs/{{name}}/{{version}}/{{filename}}";
      url = url.replace("{{name}}", pkgName);
      url = url.replace("{{version}}", version);
      url = url.replace("{{filename}}", filename);
      return url;
    },

    apiSearch: function(name) {
      var url = "http://api.cdnjs.com/libraries?search={{name}}&fields=version,description,assets,dependencies";
      return url.replace("{{name}}", name);
    }

  };

  module.exports = link;

}())
