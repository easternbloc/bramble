Bramble
=========

Is a tool which helps you safely upgrade your [NPM](http://npmjs.org)
dependencies.

[![Build Status](https://travis-ci.org/easternbloc/bramble.png)](https://travis-ci.org/easternbloc/bramble)

[![NPM](https://nodei.co/npm/bramble.png?downloads=true&stars=true)](https://nodei.co/npm/bramble/)

Running Bramble will look at each dependency in your package.json, and one by
one will ask if you want to update that dependency (with the --prompt flag). If you let it,
Bramble will then download the latest version of that dependency, optionally (with the
--test flag) running your test suite to check for any breaking changes in the
new version. Finally, Bramble will (with the --save flag) write the new version
to your package.json.

He's also [Ben's](https://github.com/easternbloc/) cat.

![bramble cat!](http://cl.ly/image/1g2c1B2h3l0c/bramble.jpg)

## Global Install
```
npm install -g bramble
```

## Local Install
```
npm install bramble --save
```

## Usage

![](http://cl.ly/image/2c1Z3n1I2Y1G/brambleScreenshot.png)

```
Usage: bramble [--save] [--prompt] [--test] [--dev]
Usage: node index.js [--save] [--prompt] [--test] [--dev]

--save      save the package.json on a successful install (and optional --test from your package.json)
--prompt    prompt the user to install/skip and optionally test each dependency that needs updating
--test      bramble will run 'npm test' (defined in your package.json) for you after successful install of any dependencies.
            If the tests fail bramble will revert (reinstall) your previous installed package(s)
--dev       flag to update your devDependencies
```
