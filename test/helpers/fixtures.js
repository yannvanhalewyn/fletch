module.exports.dummyLib = {
  name: "jquery",
  version: "4.4.4",
  latest: "http://cdnjs.cloudflare.com/ajax/libs/jquery/4.4.4/file.js",
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
};

