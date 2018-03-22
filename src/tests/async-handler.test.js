const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { expect } = require('chai');
const { handleAsync } = require('../async-handler');

chai.should();
chai.use(sinonChai);

describe('Possible error cases', () => {
  it('Should call error-callback if async function passed to it executes function with rejected promise', async () => {
    const rejectedReason = 'Invalid operation';
    const asyncFunctionWithRejectedPromise = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(rejectedReason);
        })
      })
    };

    const errorCallbackFn = sinon.spy();

    const testAsyncFunctionWithRejectedPromise = handleAsync(async () => {
      await asyncFunctionWithRejectedPromise();
    }, errorCallbackFn);

    await testAsyncFunctionWithRejectedPromise();
    expect(errorCallbackFn).to.have.been.calledWith(rejectedReason);
  });

  it('Should call the error-callback if exception is thrown inside the function passed to it', async () => {
    const error = new Error('Error Testing');
    const errorCallbackFn = sinon.spy();

    const handleAsyncWithErrorCallback = handleAsync(async () => {
      throw error;
    }, errorCallbackFn);

    await handleAsyncWithErrorCallback();
    expect(errorCallbackFn).to.have.been.calledWith(error);
  });

  it('Should throw exception if no provided error-callback but the async function ' +
    'passed to it executes function which throws an exception', async () => {
    const rejectedReason = 'Error for handleAsync with no callback function';
    const asyncFunctionWithRejectedPromise = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(rejectedReason);
        })
      })
    };

    const testAsyncFunctionWithRejectedPromise = handleAsync(async () => {
      await asyncFunctionWithRejectedPromise();
    });

    testAsyncFunctionWithRejectedPromise()
      .catch(err => {
        expect(err.message).to.have.string(rejectedReason);
      });
  });
});

describe('Success cases', () => {
  it('Should be able to return value', async () => {
    const numbers = [4,6,7,23,5];
    const asyncFunctionWithResolvedPromise = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(numbers);
        })
      })
    };

    const errorCallbackFn = sinon.spy();

    const testAsyncFunctionWithResolvedPromise = handleAsync(async () => {
      return  await asyncFunctionWithResolvedPromise();
    }, errorCallbackFn);
    const returnedValue = await testAsyncFunctionWithResolvedPromise();

    expect(errorCallbackFn).to.not.have.been.called;
    expect(returnedValue).to.equal(numbers);
  });

  it('Should be able work with parameters like in expressJS', async () => {
    const asyncFunctionWithParam = (param) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(param);
        })
      })
    };

    const errorCallbackFn = sinon.spy();

    const testAsyncFunctionWithParamsLikeInExpressJS = handleAsync(async (req, res, next) => {
      const names = await asyncFunctionWithParam(req.names);
      next(names);
    }, errorCallbackFn);

    // Mimicking expressJS here
    const req = { names: ['ragnarok', 'drift', 'furious', 'infinity'] };
    const res = null;
    const next = sinon.spy();

    await testAsyncFunctionWithParamsLikeInExpressJS(req, res, next);

    expect(next).to.have.been.calledWith(req.names);
    expect(errorCallbackFn).to.not.have.been.called;
  });

});

