'use strict';

var cp = require('child_process'),
    Q = require('q'),
    npm = require('npm'),
    path = require('path'),
    packagePath = path.resolve(process.cwd(), './package.json');

// make npm quiet for list command using a child process
module.exports.list = function (packageJson, devFlag) {
    var deferred = Q.defer();

    process.stdout.write('Checking npm this may take a moment');

    //to shush npm logs
    var list = cp.fork(__dirname + '/list', {
        cwd: process.cwd(),
        silent: true
    });

    list.on('message', function (packageArr) {
        deferred.resolve(packageArr);
    });

    list.send({packageJson: packageJson, devFlag: devFlag || false});

    return deferred.promise;
};


// make npm quiet for outdated command using a child process
module.exports.outdated = function (packages) {
    var deferred = Q.defer();

    //to shush npm logs
    var outdated = cp.fork(__dirname + '/outdated', {
        cwd: process.cwd(),
        silent: true
    });

    outdated.on('message', function (packagesToUpdate) {
        clearInterval(timeout);
        process.stdout.write('finished!\n');
        deferred.resolve(packagesToUpdate);
    });

    outdated.on('error', function (err) {
        deferred.reject(err);
    });

    outdated.send(packages);

    timeout = setInterval(function () {
        process.stdout.write('.');
    }, 1000);

    return deferred.promise;
};

module.exports.install = function (packagesToUpdate, options) {
    if (typeof packagesToUpdate === 'string') {
        packagesToUpdate = [packagesToUpdate];
    }

    var deferred = Q.defer();

    //to shush npm logs
    var install = cp.fork(__dirname + '/install', {
        cwd: process.cwd(),
        silent: true
    });

    install.on('message', function () {
        deferred.resolve();
    });

    install.on('error', function (err) {
        deferred.reject(err);
    });


    install.send({packagesToInstall: packagesToUpdate, options: options});

    return deferred.promise;
};

module.exports.test = function () {
    var deferred = Q.defer();

    npm.load('../package', function () {
        npm.commands.test(function (err) {
            if (!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }
        });
    });

    return deferred.promise;
};