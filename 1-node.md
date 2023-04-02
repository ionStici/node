# Node.js

**Node.js** is a JavaScript runtime.

A **runtime** converts code written in a high-level, human-readable, programming language and compiles it down to code the computer can execute.

<br>

## The Node REPL

**REPL** (read-eval-print loop) is a program that loops, or repeatedly cycles, through three different states: a _read_ state where the program reads input from a user, the _eval_ state, where the program evaluates the user's input, and the _print_ state where the program prints out its evaluation to a console. Then it _loops_ through these states again.

Node comes with a built-in JavaScript REPL. Access REPL by typing the command `node`. The Node REPL will evaluate your input line by line.

By default, you indicate the input is ready for eval when you hit enter.

Each session of the REPL has a single shared memory, you can access any variables or functions you define until you exit the REPL.

REPL displays the return of each evaluated line. Instead of `console.log(global)`, you can type just `global`.

- If you’d like to type multiple lines and then have them evaluated at once, type: `.editor`.
- Type `control` + `d` for the input to be evaluated.

The Node environment contains a number of Node-specific global elements. Every Node-specific global property sits inside the Node `global` object. This object contains a number of useful properties and methods that are available anywhere in the Node environment.

The `Window` object is the JS object in the browser that holds the DOM, since we don't have a DOM in node, there's no `Window` object.

To run a JavaScript file, in the terminal run the command: `node script.js`

<br>

## Core Modules

Using the `require()` function, we can include files in other files.

**Core modules** (built-in modules) are used to perform common tasks efficiently. They are defined within Node's source code and are located in the **lib/** folder. Core modules can be required by passing a string with the name of the module into the `require()` function:

```js
// Require in the 'events' core module:
const events = require("events");
```

Here we require the `events` module and store it in an `events` variable.

A complete list of core modules can be accessed by typing:

```js
const modules = require("module").builtinModules;
```

<br>

## The Console Module

The built-in `console` global module, is an object that provides familiar methods:

- `.log()` — print messages to the terminal.
- `.assert()` — print a message to the terminal if the value is falsy.
- `.table()` — print out a table in the terminal from an object or array.

`console` can be accessed from anywhere, the `require` function is not necessary.

<br>
