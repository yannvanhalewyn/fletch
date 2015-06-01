FLETCHER
========

Get your libraries and scripts from the interwebs fast and easy!

Fletcher is inspired by tools like
[pulldown](https://github.com/jackfranklin/pulldown), but focuses on a faster
experience and a way to download all the files linked to a package, including
dependencies.

![general screenshot](http://i.imgur.com/C1L00v4.png "Screenshot")

Installation
------------

```
$ npm install -g fletcher
```

This gives you a command-line command you can run from anywhere in your system.

Usage
-----

```
fletcher <packageName> [options]
```

### Options
    -o, --options	Specify the ouput directory.
    -v, --version	Specify a version (semver support)
    -h, --help		Show help page

### Examples
```
fletcher jquery
```
Downloads latest version of jQuery to current dir

```
fletcher jquery -o lib/deps
```
Downloads latest version of jQuery to the lib/deps/ directory

```
fletcher jquery -v "<2"
```
Downloads a version of jQuery that's lower than 2.0.0

## Conflicts

Fletcher prompts the user when multiple packages have been found
![Conflict screenshot](http://i.imgur.com/nuCsTJm.png)

## Dependencies

Fletcher scans for dependencies and asks you if you want'em.
![Dependency screenshot](http://i.imgur.com/LBnjbGR.png)

## Dependency conflicts

Will, again, ask you to resolve any conflicts found when looking for dependent
files.
![Dependency conflict](http://i.imgur.com/udIswUN.png)

## Running tests

If you want to run the tests, you need mocha installed. Please run

`npm install -g mocha`

Then you'll need to pulldown the devdependencies

`npm install`

Now running either `mocha` or `npm test` will run the test suite.




