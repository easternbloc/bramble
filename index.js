'use strict';

require('colors');

var npm = require('./lib/npm'),
    readline = require('readline'),
    Q = require('q'),
    path = require('path'),
    packageJson = require(path.resolve(process.cwd(), './package.json')),
    Spinner = require('cli-spinner').Spinner;

var run = function bramble (args) {

    var installOptions = {
        save: args.save || false,
        dev: args.dev || false
    };

    npm.list(packageJson, args.dev)
        .then(function (packages) {
            return npm.outdated(packages);
        }, function (err) {
            process.stdout.write(('\nNPM list failed').red);
            throw err;
        })
        .then(function (outdatedPackages) {
            if (args.prompt) {
                var rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                var fns = outdatedPackages.map(function (pack) {
                    if (pack[2] !== pack[4]) {
                        var semVerRange = pack[5].match(/[~^]/g) || '';
                        var latestPackage = pack[1] + '@' + semVerRange + pack[4];
                        var previousPackage = pack[1] + '@' + semVerRange + pack[2];

                        return function () {
                            var deferred = Q.defer();
                            rl.question('Do you want to upgrade the package ' + previousPackage.green + ' to the latest version ' + latestPackage.green + ' (Y/N/T): ', function (answer) {
                                if (answer.toLowerCase().indexOf('y') !== -1) {
                                    npm.install(latestPackage, installOptions)
                                        .then(function () {
                                            if (args.test || answer.toLowerCase().indexOf('t') !== -1) {
                                                return npm.test();
                                            } else {
                                                return new Q();
                                            }
                                        }, function () {
                                            process.stdout.write(('\nNPM install failed for ' + latestPackage).red);
                                            return deferred.reject();
                                        })
                                        .then(deferred.resolve, function () {
                                            process.stdout.write(('\nNPM tests failed for ' + latestPackage + ' restoring to old version ' + previousPackage).red);
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
                        var semVerRange = pack[5].match(/[~^]/g) || '';
                        packagesToUpdate.push(pack[1] + '@' + semVerRange + pack[4]);
                        previousPackages.push(pack[1] + '@' + semVerRange + pack[2]);
                    });
                    var installSpinner = new Spinner(('Installing the latest packages ' + packagesToUpdate.toString().replace(',', ', ') + ' %s').green);
                    installSpinner.setSpinnerString(5);
                    installSpinner.start();
                    return npm.install(packagesToUpdate, installOptions)
                        .then(function () {
                            if (args.test) {
                                return npm.test();
                            } else {
                                return new Q();
                            }
                        }, function (err) {
                            process.stdout.write(('\nNPM install failed').red);
                            throw err;
                        })
                        .fin(function () {
                            installSpinner.stop();
                        })
                        .fail(function () {
                            var revertSpinner = new Spinner(('NPM tests failed restoring to old versions ' + previousPackages.toString().replace(',', ', ') + ' %s').red);
                            revertSpinner.setSpinnerString(5);
                            revertSpinner.start();
                            return npm.install(previousPackages, installOptions).fail(function (err) {
                                revertSpinner.stop();
                                throw err;
                            });
                        });
                } else {
                    process.stdout.write('\nNothing to update!');
                    return new Q();
                }
            }
        })
        .then(function () {
            process.stdout.write('\nFinished!\n'.green);
            process.exit(0);
        }, function () {
            process.stdout.write('\nFailed!\n'.red);
            process.exit(1);
        });
};

module.exports = run;
