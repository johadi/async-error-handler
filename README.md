## Async Error Handler [![Build Status](https://travis-ci.org/johadi10/async-error-handler.svg?branch=master)](https://travis-ci.org/johadi10/async-error-handler) [![Coverage Status](https://coveralls.io/repos/github/johadi10/async-error-handler/badge.svg?branch=master)](https://coveralls.io/github/johadi10/async-error-handler?branch=master)


Simple function for handling errors when working with async and await. Instead of wrapping
async functions in `try and catch` block all the time to handle possible errors,
`async-error-handler` provides you a reusable function that conveniently handles the errors.
### installation:
`npm install async-error-handler --save`

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

getUsersByLocationAndGender('wakanda', 'female')
  .then(result => {
    // result = Females in Wakanda
  });
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

getUsers()
  .then(users => {
    // users = list of users
  });

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

getUsersByLocationAndGender('wakanda', 'male')
  .then(result => {
    // result =  Males in Wakanda
  });
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
#### With ReactJS
`async error handler` can also be used with arrow function in ReactJS. Since `ES6` has not yet supported arrow function for declaring method in a class,
 you might have to make use of babel plugin called `babel-plugin-transform-class-properties` or any other tools that can transpile the arrow function.
```javascript
import React, { Component } from 'react';
import handleAsync from 'async-error-handler';
import axios from 'axios';

class User extends Component {
  constructor(props) {
      super(props);
      this.state = {userDetails: null, error: null};
    }
  
  handleClick = handleAsync(async () => {
      const axiosResponse = await axios.get('/api/profile');
      this.setState({ userDetails: axiosResponse.data });
    },(err) => {
      // Do what you want with the error
      this.setState({ error: err });
    });
  
  render(){
      const { userDetails, error } = this.state;
  
      return !error ? (
        <div>
          <h2>Async Error Handler with ReactJS Demo</h2>
          {userDetails ? <p>{`Welcome ${userDetails.name}, you are ${userDetails.age} years old`}</p> : null}
          <button onClick={this.handleClick}>Show my Details</button>
        </div>
      ) : <div>{error.message}</div>;
    }
}
```
### Note:
- This handler should be used with functions that use async and await.
- It is advisable to always pass the second argument `(the error callback)` to the handler to avoid any uncaught error.
### async-error-handler Parameters

| params | description |
| --- | --- |
| asyncFunc | The async function to be handled |
| errorCallback | The callback to be called when the `asyncFunc` throws an exception. Any arguments passed to the `asyncFunc` will be available to the `errorCallback` as next arguments after the `err` argument.<br>Something like `(err, ...args)` where `...args` are arguments passed to `asyncFunc` |

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
