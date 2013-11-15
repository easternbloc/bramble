bramble
=========

A tool to easily update and test your package.json against the latest versions.

He's also my cat.

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