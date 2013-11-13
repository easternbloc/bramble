var npm = require('./lib/npm'),
    args = require('argh').argv,
    readline = require('readline'),
    Q = require('q'),
    color = require('colors');

npm.list(args.dev)
    .then(function (packages) {
        return npm.outdated(packages);
    })
    .then(function (outdatedPackages) {
        if (args.prompt) {
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            var fns = outdatedPackages.map(function (package) {
                if (package[2] !== package[4]) {
                    var latestPackage = package[1] + '@' + package[4];
                    var previousPackage = package[1] + '@' + package[2];

                    return function () {
                        var deferred = Q.defer();
                        console.log('Do you want to upgrade the package ' + previousPackage.green + ' to the latest version ' + latestPackage.green + ' (Y/N/T): ');
                        rl.question('', function (answer) {
                            if (answer.toLowerCase().indexOf('y') !== -1) {
                                npm.install(latestPackage, args.save)
                                    .then(function () {
                                        if (args.test || answer.toLowerCase().indexOf('t') !== -1) {
                                            return npm.test();
                                        } else {
                                            return Q();
                                        }
                                    }, function (err) {
                                        console.log(('NPM install failed for ' + latestPackage).red);
                                        return deferred.reject();
                                    })
                                    .then(deferred.resolve, function (err) {
                                        console.log(('NPM tests failed for ' + latestPackage + ' restoring to old version ' + previousPackage).red);
                                        return npm.install(previousPackage, args.save).then(deferred.resolve, deferred.reject);
                                    });
                            } else {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    };
                } else {
                    return Q();
                }
            });

            return fns.reduce(Q.when, Q()).then(function () {
                rl.close();
            });
        } else {
            if (outdatedPackages.length > 0) {
                //install everything at once
                var packagesToUpdate = [];

                outdatedPackages.forEach(function (package) {
                    packagesToUpdate.push(package[1] + '@' + package[4]);
                });

                console.log(('Installing the latest packages ' + packagesToUpdate.toString().replace(',', ', ')).green);

                return npm.install(packagesToUpdate, args.save);
            } else {
                console.log('Nothing to update!');
                return Q();
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