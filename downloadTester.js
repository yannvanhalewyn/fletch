var dl = require('./lib/libdownloader');

var lib = {
  name: "react",
  version: "0.13.3",
  assets: [
    {
      version: "0.13.3",
      files: [
        { name: 'JSXTransformer.js', size: 532 },
        { name: 'react-with-addons.js', size: 647 },
        { name: 'react-with-addons.min.js', size: 131 },
        { name: 'react.js', size: 589 },
        { name: 'react.min.js', size: 121 }
      ]
    }
  ]
}

console.log(dl.download(lib, lib.version));
