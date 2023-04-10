[&larr; Back](./README.md)

# Node.js

[**Node.js**](https://nodejs.org/en/docs) is a JavaScript runtime.

A **runtime** converts code written in a high-level, human-readable, programming language and compiles it down to code the computer can execute.

<br>

## The Node REPL

**REPL** (read-eval-print loop) is a program that loops through three different states: a **read** state where the program reads input from the user, the **eval** state where the program evaluates the user's input, and the **print** state where the program prints out its evaluation to the console. Then it **loops** through these states again.

Node comes with a built-in JavaScript REPL. Access REPL by typing the command `node`. The Node REPL will evaluate your input line by line.

By default, you indicate the input is ready for eval when you hit enter.

Each session of the REPL has a single shared memory, you can access any variables or functions you define until you exit the REPL.

REPL displays the return of each evaluated line, so instead of `console.log(global)`, you can type just `global`.

### global object

The Node environment contains a number of Node-specific global elements. Every Node-specific global property sits inside the Node `global` object. This object contains a number of useful properties and methods that are available anywhere in the Node environment.

The `Window` object is the JS object in the browser that holds the DOM, since we don't have a DOM in node, there's no `Window` object.

### REPL editor

- If you’d like to type multiple lines and then have them evaluated at once, type `.editor`.
- Then, type `control` + `d` for the input to be evaluated.

### Execute a file with node

To execute a JavaScript file, run the following command in the terminal:

```
node script.js
```

<br>
