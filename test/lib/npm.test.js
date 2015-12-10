'use strict';

var npmWrapper = require('../../lib/npm'),
    npm = require('npm');

describe('npm()', function () {
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

        afterEach(function () {
            npm.load.restore();
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