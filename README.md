FLETCH
======

Get your libraries and scripts from the interwebs fast and easy!

Fletch is inspired by tools like
[pulldown](https://github.com/jackfranklin/pulldown), but focuses on a faster
experience and a way to download all the files linked to a package, including
dependencies.

![general screenshot](http://i.imgur.com/t5qlkVr.png "Screenshot")

Installation
------------

```
$ npm install -g fletch
```

This gives you a command-line command you can run from anywhere in your system.

Usage
-----

```
$ fletch <packageName> [options]
```

### Options
    -o, --options	Specify the ouput directory
    -v, --version	Specify a version (semver support)
    -h, --help		Show help page
    -s, --silent	Discrete output: will only show prompts
    -m, --minimal	Download only the main file (e.g.: jquery.min.js)
    -t, --tag		Prints out html script/link tags instead of downloading


### Examples
```
$ fletch jquery
```
Downloads latest version of jQuery to current dir

```
$ fletch jquery -o lib/deps
```
Downloads latest version of jQuery to the lib/deps/ directory

```
$ fletch jquery -v "<2"
```
Downloads a version of jQuery that's lower than 2.0.0

```
$ fletch jquery -t
```
Prints out a script tag for every file in the package

## Tags
![Tags screenshot](http://i.imgur.com/WEXAeVu.png)

## Conflicts

Fletch prompts the user when multiple packages have been found
![Conflict screenshot](http://i.imgur.com/2JIsNbs.png)

## Dependencies

Fletch scans for dependencies and asks you if you want'em.
![Dependency screenshot](http://i.imgur.com/pBSW5mS.png)

## Dependency conflicts

Will, again, ask you to resolve any conflicts found when looking for dependent
files.
![Dependency conflict](http://i.imgur.com/qZyTxGF.png)

## Running tests

If you want to run the tests, you need mocha installed. Please run

`$ npm install -g mocha`

Then you'll need to pulldown the devdependencies

`$ npm install`

Now running either `mocha` or `npm test` will run the test suite.

## Tips

If you rocking vim as a text editor, try running `:r !fletch jquery -mt`, and
you'll see a script tag for the latest version of jQuery appear under your
cursor. Sweet huh?
