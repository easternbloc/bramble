'use strict';

var npm = require('npm');

function list(options) {
    npm.load('./package', function () {
        //We're not interested in what other peoples packages are doing
        npm.config.set('depth', 0);

        npm.commands.list(function () {
            var packageArr = [],
                dependencies = options.devFlag ? 'devDependencies' : 'dependencies';

            for (var pack in options.packageJson[dependencies]) {
                if (options.packageJson[dependencies][pack]) {
                    packageArr.push(pack);
                }
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
}

process.on('message', list);

module.exports = list;