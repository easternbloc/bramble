'use strict';

var outdated = require('../../lib/outdated'),
    npm = require('npm');

describe('outdated()', sandbox(function () {
    var packages = ['npm', 'q'];

    beforeEach(function () {
        // [[ dir, dep, has, want, latest ]]
        var outdatedPackages = [
                ['directory', 'npm', '0.0.1', '0.0.2', '0.0.3'],
                ['directory', 'q', '0.0.2', '0.0.3', '0.0.4'],
                ['directory', 'hasnonewversion', '0.0.2', '0.0.2', '0.0.2'],
                ['directory', 'anotherpackagewithnoupdates', '0.0.3', '0.0.3', '0.0.3']
            ];

        this.stub(npm, 'load').yields();
        npm.commands = {
            outdated: this.stub().yields(undefined, outdatedPackages)
        };

        //hmmmmm
        process.send = this.stub();
        process.exit = this.stub();

        outdated(packages);
    });

    it('calls npm.load()', function () {
        npm.load.should.have.been.calledOnce;
    });

    describe('npm.load()', function () {
        it('should call npm.outdated()', function () {
            npm.commands.outdated.should.have.been.calledOnce;
            npm.commands.outdated.should.have.been.calledWith(packages);
        });

        describe('npm.outdated()', function () {
            it('should only return packges that have new versions', function () {
                process.send.should.have.been.calledWith([
                    ['directory', 'npm', '0.0.1', '0.0.2', '0.0.3'],
                    ['directory', 'q', '0.0.2', '0.0.3', '0.0.4']
                ]);
            });

            it('should close the child process when done', function () {
                process.exit.should.have.been.calledWith(0);
            })
        });
    });

}));
