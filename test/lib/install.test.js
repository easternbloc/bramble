'use strict';

var install = require('../../lib/install'),
    npm = require('npm');

describe('install()', sandbox(function () {
    var outdatedPackages = ['npm@0.0.3', 'q@0.0.4'],
        deferred, stub;

    beforeEach(function () {
        this.stub(npm, 'load').yields();
        npm.commands = {
            install: this.stub().yields()
        };

        npm.config = {
            set: this.stub()
        };

        process.send = this.stub();
        process.exit = this.stub();


        deferred = install({packagesToInstall: outdatedPackages, options: {save: true}});
    });

    afterEach(function () {
        npm.load.restore();
    });

    it('calls npm.load()', function () {
        npm.load.should.have.been.calledOnce;
    });

    describe('npm.load()', function () {
        it('should call config.set() with save if save flag is passed', function () {
            npm.config.set.should.have.been.calledWith('save', true);
        });

        it('should call npm.install()', function () {
            npm.commands.install.should.have.been.calledOnce;
            npm.commands.install.should.have.been.calledWith(outdatedPackages);
        });
    });
}));
