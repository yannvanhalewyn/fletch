module.exports.dummyJquery = function() {
  return {
    name: "jquery",
    version: "4.4.4",
    latest: "http://cdnjs.cloudflare.com/ajax/libs/jquery/4.4.4/latest.js",
    assets: [
      {
        version: "4.4.4",
        files: [ "file1-4.4.4.js", "file2-4.4.4.js" ]
      },
      {
        version: "4.1.1",
        files: [ "js/file1-4.1.1.js", "css/file2-4.1.1.js" ]
      },
      {
        version: "3.3.3",
        files: [ "file1-3.3.3.js", "file2-3.3.3.js" ]
      }
    ]
  }
};

module.exports.dummyUnderscore = function() {
  return {
    name: "underscore.js",
    latest: "https://latest.url/underscore-min.js",
    dependencies: null,
    assets: [
      {
        version: "1.8.3",
        files: [ "underscore-min.js", "underscore-min.map", "underscore.js" ]
      },
      {
        version: "1.8.2",
        files: [ "underscore-min.js", "underscore-min.map", "underscore.js" ]
      }
    ]
  }
}

module.exports.dummyEmber = function() {
  return {
    name: "ember.js",
    latest: "https://latest.url/ember.min.js",
    dependencies: {jquery: "3.2.1", underscore: "1.2.3"},
    assets: [
      {
        version: "1.13.0-beta.2",
        files: [
          "ember-template-compiler.js",,
          "ember-testing.js",,
          "ember.debug.js",,
          "ember.js",,
          "ember.min.js",,
          "ember.prod.js",
        ]
      },
      {
        version: "1.13.0-beta.1",
        files: [
          "ember-template-compiler.js",
          "ember-testing.js",
          "ember.debug.js",
          "ember.js",
          "ember.min.js",
          "ember.prod.js"
        ]
      }
    ]
  }
}

module.exports.dummyEmberFire = function() {
  return {
    name: "emberFire",
    latest: "https://cdnjs.cloudflare.com/ajax/libs/emberFire/1.0.9/emberfire.min.js",
    dependencies: null,
    assets: [
      {
        version: "1.0.9",
        files: [ "emberfire.js", "emberfire.min.js" ]
      }
    ]
  }
}
