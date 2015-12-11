'use strict';

var npm = require('npm'),
    fs = require('fs'),
    path = require('path'),
    packagePath = path.resolve(process.cwd(), './package.json');

function install(args) {
    var packagesToInstall = args.packagesToInstall;
    var options = args.options;
    npm.load('../package', function () {
        if (options.save) {
            if (options.dev) {
                npm.config.set('save-dev', true);
            } else {
                npm.config.set('save', true);
            }
        }
        npm.commands.install(packagesToInstall, function (err) {
            if (!err) {
                if (options.save) {
                    try {
                        var packageJSON = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                        var dependencyType = options.dev ? 'devDependencies' : 'dependencies';
                        packagesToInstall.forEach(function (pack) {
                            var packParts = pack.split('@');
                            var packName = packParts[0];
                            var semVerRange = packParts[1].match(/[~^]/g) || '';
                            packageJSON[dependencyType][packName] = packageJSON[dependencyType][packName].replace(/[~^]/g, '');
                            packageJSON[dependencyType][packName] = semVerRange + packageJSON[dependencyType][packName];
                        });
                        fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2));
                    } catch (err) {
                        throw new Error(err);
                    }
                }
                process.send('done');
                process.exit(0);
            } else {
                throw new Error(err);
            }
        });
    });
}

process.on('message', install);

module.exports = install;
