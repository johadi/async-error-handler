## Async Error Handler [![Build Status](https://travis-ci.org/johadi10/async-error-hanlder.svg?branch=master)](https://travis-ci.org/johadi10/async-error-hanlder)

Simple function for handling errors when working with async and await. Instead of wrapping
async functions in `try and catch` block all the time to handle possible errors,
`async-error-handler` provides you a reusable function that conveniently handles the errors.
### installation:
`npm install async-error-handler`

### Usage:
Normally, you would handle errors in your async function like this:
```javascript
const getUsersByLocationAndGender = async (location, gender) => {
  
  try {
    
    const result = await db.findUsers({location, gender});
    return result;
    
  } catch (err) {
    // do something with err when exception is thrown.
  }
  
};

const wakandaFemales = getUsersByLocationAndGender('wakanda', 'female'); // all females in Wakanda
```

For expressJS route, you would have to do something like this:
```javascript
app.get('/api/users',async (req, res, next) => {
  
  try {
    
    const result = await db.findUsers();
    res.status(200).send(result);
  
  } catch (err) {
    next(err); // or res.status(500).send(err);
  }
  
});
```

While this is a good approach to catch exceptions in your function, there are drawbacks when you have to deal with many async functions. Some are listed below:
* You would have to be writing try and catch all the time. Thereby, not respecting the **DRY** `(don't repeat yourself)` principle.
* Your code becomes ugly which can affect readability.
* You would have compromised **SRP** `(Single Responsibility Principle)` as your function now has to do its primary work and also handle errors by itself.

`async-error-handler` solves this problem. The various ways you can use it are shown below:

#### With function that has no parameter

```javascript
const handleAsync = require('async-error-handler');

const getUsers = handleAsync(async () => {
  const result = await db.findUsers();
  return result;
}, function(err){
  // ...do something with the error
});

const users = getUsers(); // list of users
```
#### With function that has parameters

When the function is called and exception is thrown, any supplied arguments will also be passed to the `error callback` as the next arguments
after the `err` argument. Something like: `(err, arg1, arg2, ...) => {}`. Check example below.
```javascript
const handleAsync = require('async-error-handler');

const getUsersByLocationAndGender = handleAsync(async (location, gender) => {
  const result = await db.findUsers({location, gender});
  return result;
}, (err, location, gender) => {
  // ... do something with the err and other arguments passed to the `error callback`.
});

const wakandaMales = getUsersByLocationAndGender('wakanda', 'male'); // males in Wakanda
```
#### With expressJS
When used in `expressJS route callback`, if exception is thrown, all arguments express does pass to route callback will also be available to the `error callback` immediately after the `err` argument.
See example below:

```javascript
const handleAsync = require('async-error-handler');

app.get('/api/users', handleAsync(async (req, res, next) => {
  const result = await db.findUsers();
  res.status(200).send(result);

}, (err, req, res, next) => {
  // ... do something with the err argument and other arguments expressed passed to the `error callback`.
  next(err);  // or res.status(500).send(err);
}));
```
### Note:
- This handler should be used with functions that use async and await.
- It is advisable to always pass the second argument `(the error callback)` to the handler to avoid any uncaught error.
### async-error-handler Parameters

| params | description |
| --- | --- |
| asyncFunc | The async function to be handled |
| errorCallback | The callback to be called when the `asyncFunc` throws an exception. Any arguments passed to the `asyncFunc` will be available to the `errorCallback` as next arguments after the `err` argument. Something like `(err, ...args)` where `...args` are arguments passed to `asyncFunc` |

### Testing
`npm run test`

### Contributing

The project is open to contributions. Simply follow this guide:
- Fork the repo
- Make your contribution
- Test your work and ensure it passes.
- Create PR against the **develop** branch.

### License
MIT
