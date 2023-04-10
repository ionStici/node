[&larr; Back](./README.md)

## The Process Module

[`process` documentation](https://nodejs.org/api/process.html)

In computer science, a **process** is the instance of a computer program that is being executed.

- The global node object `process` contains useful methods and information about the current process.
- The `process.env` property is an object which stores and controls information about the environment in which the process is currently running.
- `process.env.PWD` property holds a string with the directory in which the current process is located.
- The `process.memoryUsage()` returns information on the CPU demands of the current process.
- `process.memoryUsage().heapUsed` returns a number representing how many bytes of memory the current process is using.
- `process.argv` property holds an array of command line values provided when the current process was initiated.
  - The first element in the array is the absolute path to Node, which run the process.
  - The second element is the path to the file that's running.
  - The following elements will be any command line arguments provided when the process was initiated.

Command line arguments are separated from one another with spaces:

```
node main.js testing features
```

```js
process.argv[2]; // testing
```

<br>

## The OS Module

```js
const os = require("os");

const local = {
  "Operating System": os.type(), // computer's operating system
  "CPU architecture": os.arch(), // operating system CPU architecture
  "Network Interfaces": os.networkInterfaces(), // network interfaces (IP / MAC)
  "Home Directory": os.homedir(), // current user's home directory
  Hostname: os.hostname(), // the hostname of the operating system
  "Last Reboot": os.uptime(), //the system uptime (in seconds)
};
```

<br>

## The Util Module

The Node `util` core module contains methods specifically designed for utility purposes.

```js
const util = require("util");
```

The `types` utility object provides methods for runtime type checking in Node.

```js
const today = new Date();
console.log(util.types.isDate(today)); // true
```

Here we do type checking using `util.types.isDate()`. It will check for `Date` objects and returns a boolean value.

<br>

### promisify

`util.promisify()` method will turn callback functions into promises.

```js
const getUser = function () {};
const getUserPromise = util.promisify(getUser);
getUserPromise(id).then().catch();
```

The `getUser` method is turned into a promise using the `.promisify()` method.

<br>

## The Events Module

Node - event-driven architecture.

Node provides an `EventEmitter` class which we can access by requiring the `events` core module:

```js
let events = require("events");

// Create an instance of the EventEmitter class
let emitter = new events.EventEmitter();
```

Each event emitter instance has an `.on()` method which assigns a listener callback function to a named event. The `.on()` method takes as its first argument the name of the event as a string and, as its second argument, the listener callback function.

Each event emitter instance also has an `.emit()` method which announces a named event has occurred. The `.emit()` method takes as its first argument the name of the event as a string and, as its second argument, the data that should be passed into the listener callback function.

```js
let listener = (data) => {
  console.log(data);
};

emitter.on("new user", listener);

emitter.emit("new user", listener);
```

<br>

## User Input/Output

In the Node environment, the console is the terminal, and the `console.log()` method is a “thin wrapper” on the `.stdout.write()` method of the `process` object. `stdout` stands for standard output.

In Node, we can also receive input from a user through the terminal using the `stdin.on()` method on the `process` object.

```js
process.atdin.on("data", (userInput) => {
  let input = userInput.toString();
  console.log(input);
});
```

Here, we were able to use `.on()` because under the hood `process.stdin` is an instance of `EventEmitter`.

When a user enters text into the terminal and hits enter, a `'data'` event will be fired and our anonymous listener callback will be invoked.

The `userInput` we receive is an instance of the Node `Buffer` class, so we convert it to a string before printing.

<br>

## The Error Module

The Node environment’s `error` module (global scope) has all the standard JavaScript errors, as well as the `Error` class for creating new error instances.

- We can generate and throw errors.
- We can use error handling techniques such as `try...catch` statements.

Many asynchronous Node APIs use _error-first callback functions_. Callback functions which have an error as the first expected argument and the data as the second argument. If the asynchronous task results in an error, it will be passed in as the first argument to the callback function. If no error was thrown, the first argument will be `undefined`.

```js
const errorFirstCallback = (err, data) => {
  if (err) {
    console.log(`There WAS an error: ${err}`);
  } else {
    console.log(data);
  }
};
```

In node, we use error-first callbacks in many of its asynchronous APIs, because traditional `try...catch` statements won't work for errors thrown during asynchronous operations.

<br>

## The Buffer Module

The `Buffer` module (global scope) is used to handle binary data.

A `Buffer` object represents a fixed amount of memory that can’t be resized. `Buffer` objects are similar to an array of integers where each element in the array represents a byte of data. The buffer object will have a range of integers from 0 to 255 inclusive.

The Buffer module provides a variety of methods to handle the binary data such as `.alloc() .toString() .from() .concat()`

<br>

**`alloc()`** method creates a new `Buffer` object, it accepts three arguments:

- Size: Required. The size of the buffer
- Fill: Optional. A value to fill the buffer with. Default is 0.
- Encoding: Optional. Default is UTF-8.

```js
const buffer = Buffer.alloc(5);
console.log(buffer); // Ouput: [0, 0, 0, 0, 0]
```

<br>

**`toString()`** method translates the `Buffer` objects into a human-readable string. It accepts 2 optional arguments:

- Encoding: Default is UTF-8.
- Start: The byte offset to begin translating in the Buffer object. Default is 0.
- End: The byte offset to end translating in the Buffer object. Default is the length of the buffer. The start and end of the buffer are similar to the start and end of an array, where the first element is 0 and increments upwards.

```js
const buffer = Buffer.alloc(5, "a");
console.log(buffer.toString()); // Output: aaaaa
```

<br>

**`from()`** method - to create a new `Buffer` object from the specified string, array, of buffer. It accepts 2 arguments:

- Object: Required. An object to fill the buffer with.
- Encoding: Optional. Default is UTF-8.

```js
const buffer = Buffer.from("hello");
console.log(buffer); // Output: [104, 101, 108, 108, 111]
```

<br>

**`concat`** method joins all buffer objects passed in an array into one `Buffer` object. It accepts 2 arguments:

- Array: Required. An array containing `Buffer` objects.
- Length: Optional. Specifies the length of the concatenated buffer.

```js
const bufferConcat = Buffer.concat([buffer1, buffer2]);
```

`concat()` comes in handy because a `Buffer` object can’t be resized.

<br>

## The FS Module

All of the data on a computer is organized and accessed through a filesystem. When running JavaScript code on a browser, it’s important for a script to have only limited access to a user’s filesystem. This technique of isolating some applications from others is known as sandboxing. Sandboxing protects users from malicious programs and invasions of privacy.

In the back-end, however, less restricted interaction with the filesystem is essential. The Node `fs` core module is an API for interacting with the file system. It was modeled after the POSIX standard for interacting with the filesystem.

Each method available through the `fs` module has a synchronous version and an asynchronous version. One method available on the `fs` core module is the `.readFile()` method which reads data from a provided file:

```js
const fs = require("fs");

fs.readFile("./file.txt", "utf-8", readDataCallback);
```

We invoked the `.readFile()` method with three arguments:

1. The first argument is a string that contains a path to the file file.txt.
2. The second argument is a string specifying the file’s character encoding (usually ‘utf-8’ for text files).
3. The third argument is the callback function to be invoked when the asynchronous task of reading from the file system is complete. Node will pass the contents of file.txt into the provided callback as its second argument.

<br>
