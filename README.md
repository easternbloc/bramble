bramble
=========

A tool to easily update and test your package.json against the latest versions.

## Global Install
```
npm install -g bramble
```

## Local Install
```
npm install bramble --save
```

## Usage

```
Usage: bramble [--save] [--prompt] [--test] [--dev]
Usage: node index.js [--save] [--prompt] [--test] [--dev]

--save      save the package.json on a successful install (and optional npm test from your package.json)
--prompt    prompt the user to install/skip and optionally test each dependency that needs updating
--test      run the tests for each install in your package.json (used with prompt)
            If the tests fail bramble will revert to your previous installed package
--dev       flag to update your devDependencies
```