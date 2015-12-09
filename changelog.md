# Bramble Change log

## 9 Dec 2015, 1.1.0

* Respect semver options on packages. Previously bramble would just remove "~" or "^" bramble now respects this and applies it to the package. If you need to lock down your dependencies use npm shrinkwrap.

## 9 Dec 2015, 1.0.2

* Added help to be more helpful (--help)

## 9 Dec 2015, 1.0.1

* Updated to support node 4.x and npm 3.x
* Updated dependencies

## 30 Nov 2013, 0.1.4

* Bramble no longer allows "~" to be used in package versions.
* Updated dependencies

## 15 Nov 2013, 0.1.3

* Updated dev dependencies

## 15 Nov 2013, 0.1.2

* Fixed lots of jshint errors
* Wrote a bunch of tests

## 13 Nov 2013, 0.1.1

* Test flag was being ignored if not in --prompt mode
* Using semvar for version checking

## 13 Nov 2013, 0.1.0

* Initial publication.
