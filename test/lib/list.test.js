'use strict';

var list = require('../../lib/list'),
    npm = require('npm');

describe('list()', sandbox(function () {

    beforeEach(function () {
        var realPackageJson = {
                dependencies: {
                    'npm': '0.1.1',
                    'q': '0.2.0',
                },
                devDependencies: {
                    'semver': '2.2.1'
                }
            };

        this.stub(npm, 'load').yields();
        npm.commands = {
            list: this.stub().yields()
        };
        npm.config = {
            set: this.stub()
        };

        //hmmmmm
        process.send = this.stub();
        process.exit = this.stub();

        list({
            packageJson: realPackageJson,
            devFlag: false
        });
    });

    it('calls npm.load()', function () {
        npm.load.should.have.been.calledOnce;
    });

    describe('npm.load()', function () {
        it('should call config.set() to ensure we only look at our installed packages', function () {
            npm.config.set.should.have.been.calledWith('depth', 0);
        });

        it('should call npm.list()', function () {
            npm.commands.list.should.have.been.calledOnce;
        });

        describe('npm.list()', function () {
            it('should only return packges from your package.json', function () {
                process.send.should.have.been.calledWith(['npm', 'q']);
            });

            it('should close the child process when done', function () {
                process.exit.should.have.been.calledWith(0);
            });
        });
    });

}));
