var npm = require('npm');

process.on('message', function (dependencyList) {
    npm.load('./package', function (err) {
        //We're not interested in what other peoples packages are doing
        npm.config.set('depth', 0);

        npm.commands.list(function (err, packages) {
            var packageArr = [],
                dependencies = dependencyList ? 'devDependencies' : 'dependencies';

            for (var package in packages[dependencies]) {
                packageArr.push(package);
            }

            // TODO: this should work but npm is currently broken with the depth flag
            // https://github.com/isaacs/npm/issues/2843

            // if (!err) {
            //     process.send(packageArr);
            // } else {
            //     process.send(err);
            // }

            process.send(packageArr);
            process.exit(0);
        });
    });
});