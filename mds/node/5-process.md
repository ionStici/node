[&larr; Back](./README.md)

# The Process Module

[Node `process` documentation](https://nodejs.org/api/process.html)

In computer science, a **process** is an instance of a running program that is being executed by the OS.

The global node `process` object represents the current Node process.

The `process` object provides information about and control over the current **process**.

<br>

## env

**`process.env`**

An object containing the environment variables of the current node process.

e.g. `.PWD .PATH .USER`

<br>

## argv

**`process.argv`**

An array containing command-line arguments passed when the current process was initiated.

1. The first element in the array is the Node.js executable path (that runs the process).
2. The second element is the path to the script file that is running.
3. The remaining elements are any additional command-line arguments (separated by spaces).

`node main.js testing features`

```js
process.argv[2]; // testing
```

<br>

## Other

- `process.memoryUsage()` returns information on the CPU demands of the current process.

- `process.memoryUsage().heapUsed` returns a number representing how many bytes of memory the current process is using.

- `process.cwd()` returns the current working directory of the node.js process.

- `process.chdir(directory)` a method that changes the current working directory of the Node.js process to the specified directory.

- `process.exit([code])` a method that terminates the Node.js process with the specified exit code (default is 0, which indicates a successful termination).

- `process.pid` returns the process ID of the current node.js process.

- `process.version` returns the version of the node.js runtime as a string.

- `process.versions` returns an object containing the version strings of the Node.js runtime and its dependencies, such as V8, OpenSSL, and others.

<br>

## User Input / Output

Readable and writable stream instances:

- `process.stdin` - standard input
- `process.stdout` - standard output
- `process.stderr` - standard error

These streams are essential for communication between the Node.js process and its environment, such as the console, terminal, or other processes.

<hr>

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
