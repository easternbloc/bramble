'use strict';

require('colors');

var npm = require('./lib/npm'),
    args = require('argh').argv,
    readline = require('readline'),
    Q = require('q'),
    installOptions = {
        save: args.save || false,
        dev: args.dev || false
    },
    path = require('path'),
    packageJson = require(path.resolve(process.cwd(), './package.json'));

npm.list(packageJson, args.dev)
    .then(function (packages) {
        return npm.outdated(packages);
    })
    .then(function (outdatedPackages) {
        if (args.prompt) {
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            var fns = outdatedPackages.map(function (pack) {
                if (pack[2] !== pack[4]) {
                    var latestPackage = pack[1] + '@' + pack[4];
                    var previousPackage = pack[1] + '@' + pack[2];

                    return function () {
                        var deferred = Q.defer();
                        console.log('Do you want to upgrade the package ' + previousPackage.green + ' to the latest version ' + latestPackage.green + ' (Y/N/T): ');
                        rl.question('', function (answer) {
                            if (answer.toLowerCase().indexOf('y') !== -1) {
                                npm.install(latestPackage, installOptions)
                                    .then(function () {
                                        if (args.test || answer.toLowerCase().indexOf('t') !== -1) {
                                            return npm.test();
                                        } else {
                                            return new Q();
                                        }
                                    }, function () {
                                        console.log(('NPM install failed for ' + latestPackage).red);
                                        return deferred.reject();
                                    })
                                    .then(deferred.resolve, function () {
                                        console.log(('NPM tests failed for ' + latestPackage + ' restoring to old version ' + previousPackage).red);
                                        return npm.install(previousPackage, installOptions).then(deferred.resolve, deferred.reject);
                                    });
                            } else {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    };
                } else {
                    return new Q();
                }
            });

            return fns.reduce(Q.when, new Q()).then(function () {
                rl.close();
            });
        } else {
            if (outdatedPackages.length > 0) {
                //install everything at once
                var packagesToUpdate = [],
                    previousPackages = [];

                outdatedPackages.forEach(function (pack) {
                    packagesToUpdate.push(pack[1] + '@' + pack[4]);
                    previousPackages.push(pack[1] + '@' + pack[2]);
                });

                console.log(('Installing the latest packages ' + packagesToUpdate.toString().replace(',', ', ')).green);

                return npm.install(packagesToUpdate, installOptions)
                    .then(function () {
                        if (args.test) {
                            return npm.test();
                        } else {
                            return new Q();
                        }
                    }, function (err) {
                        console.log(('NPM install failed').red);
                        throw err;
                    })
                    .fail(function () {
                        console.log(('NPM tests failed restoring to old versions ' + previousPackages.toString().replace(',', ', ')).red);
                        return npm.install(previousPackages, installOptions).fail(function (err) { throw err; });
                    });
            } else {
                console.log('Nothing to update!');
                return new Q();
            }
        }
    })
    .then(function () {
        console.log('Finished!');
        process.exit(0);
    }, function () {
        console.log('Failed!');
        process.exit(1);
    });