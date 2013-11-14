'use strict';

var npm = require('npm'),
    semver = require('semver');

function outdated(packages) {
    npm.load('./package', function () {
        var packagesToUpdate = [];

        npm.commands.outdated(packages, function (err, outdatedPackages) {
            if (!err) {
                // [[ dir, dep, has, want, latest ]]
                outdatedPackages.forEach(function (pack) {
                    if (pack[0].indexOf('node_modules') === -1 && semver.lt(pack[2], pack[4])) {
                        packagesToUpdate.push(pack);
                    }
                });

                process.send(packagesToUpdate);
                process.exit(0);
            } else {
                throw new Error(err);
            }
        });
    });
}

process.on('message', outdated);

module.exports = outdated;