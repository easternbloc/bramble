'use strict';

var npmWrapper = require('../../lib/npm'),
    npm = require('npm');

describe('npm()', function () {
    describe('npm.install()', sandbox(function () {
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

            stub = this.stub();
            deferred = npmWrapper.install(outdatedPackages, {save: true}).then(stub);
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

            describe('npm.install()', function () {
                it('should resolve the promise on success', function () {
                    stub.should.have.been.calledOnce;
                });
            });
        });
    }));

    describe('npm.test()', sandbox(function () {
        var deferred, stub;

        beforeEach(function () {
            this.stub(npm, 'load').yields();
            npm.commands = {
                test: this.stub().yields()
            };

            stub = this.stub();
            deferred = npmWrapper.test().then(stub);
        });

        it('calls npm.load()', function () {
            npm.load.should.have.been.calledOnce;
        });

        describe('npm.load()', function () {
            it('should call npm.test()', function () {
                npm.commands.test.should.have.been.calledOnce;
            });

            describe('npm.test()', function () {
                it('should resolve the promise on success', function () {
                    stub.should.have.been.calledOnce;
                });
            });
        });
    }));
});