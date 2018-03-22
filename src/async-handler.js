const handleAsync = (asyncFunc, errorCallback) => {
  if (!errorCallback) {
    console.warn('You have called handleAsync without error handler.' +
      ' You should provide it to track errors in your async function.\n' +
      'Visit https://github.com/johadi10/async-await-handler for more info on how to add error handler');
  }

  return function(...args){
    return Promise.resolve(asyncFunc(...args))
      .catch(err => {

        if (errorCallback) {
          errorCallback(err, ...args);
        } else {
          throw new Error(err + '.\nProvide the error-callback in the handleAsync function to handle this error.');
        }

      });
  };
};

module.exports = { handleAsync };
