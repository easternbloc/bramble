var npm = require('npm');

process.on('message', function (packages) {
    npm.load('./package', function (err) {
        var packagesToUpdate = [];

        npm.commands.outdated(packages, function (err, outdatedPackages) {
            if (!err) {

                // [[ dir, dep, has, want, latest ]]
                outdatedPackages.forEach(function (package) {
                    if (package[0].indexOf('node_modules') === -1 && package[2] !== package[4]) {
                        // packagesToUpdate.push(package[1] + '@' + package[4]);
                        packagesToUpdate.push(package);
                    }
                });

                process.send(packagesToUpdate);
                process.exit(0);
            } else {
                throw new Error(err);
            }
        });
    });
});