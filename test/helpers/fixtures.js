module.exports.dummyJquery = function() {
  return {
    name: "jquery",
    version: "4.4.4",
    latest: "http://cdnjs.cloudflare.com/ajax/libs/jquery/4.4.4/latest.js",
    assets: [
      {
        version: "4.4.4",
        files: [
          { name: "file1-4.4.4.js" },
          { name: "file2-4.4.4.js" }
        ]
      },
      {
        version: "4.1.1",
        files: [
          { name: "js/file1-4.1.1.js" },
          { name: "css/file2-4.1.1.js" }
        ]
      },
      {
        version: "3.3.3",
        files: [
          { name: "file1-3.3.3.js" },
          { name: "file2-3.3.3.js" }
        ]
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
        files: [
          { name: "underscore-min.js" },
          { name: "underscore-min.map" },
          { name: "underscore.js" }
        ]
      },
      {
        version: "1.8.2",
        files: [
          { name: "underscore-min.js" },
          { name: "underscore-min.map" },
          { name: "underscore.js" }
        ]
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
          { name: "ember-template-compiler.js", },
          { name: "ember-testing.js", },
          { name: "ember.debug.js", },
          { name: "ember.js", },
          { name: "ember.min.js", },
          { name: "ember.prod.js", }
        ]
      },
      {
        version: "1.13.0-beta.1",
        files: [
          { name: "ember-template-compiler.js" },
          { name: "ember-testing.js" },
          { name: "ember.debug.js" },
          { name: "ember.js" },
          { name: "ember.min.js" },
          { name: "ember.prod.js" }
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
        files: [
          { name: "emberfire.js" },
          { name: "emberfire.min.js" }
        ]
      }
    ]
  }
}
