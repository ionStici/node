# Node.js

## Table of Contents

- [Introduction](#introduction)
- [Execute JavaScript Code with Node](#execute-javascript-code-with-node)
- [The `global` Object](#the-global-object)
- [Core Modules](#core-modules)
  - [CommonJS Modules](#commonjs-modules)
  - [ES Modules](#es-modules)
  - [The Console Module](#the-console-module)
- [Implementing Modules in Node](#implementing-modules-in-node)
  - [CommonJS: `require` / `module.exports`](#commonjs-require--moduleexports)
  - [ES Modules: `import` / `export`](#es-modules-import--export)
- [What is REPL](#what-is-repl)

## Introduction

[**Node.js**](https://nodejs.org) is a JavaScript runtime, an environment where JavaScript code is executed.

A **runtime** converts code written in a high-level programming language and compiles it down to code the computer can execute.

## Execute JavaScript Code with Node

- **Node REPL** : Access the Node REPL by typing the command `node` in the terminal. REPL displays the return of each evaluated like. If you'd like to type multiple lines and then have them evaluated at once, type `.editor` to enter editor mode, and then press `control` + `d` for the input to be evaluated.

- **Execute File** : To execute a JavaScript file with node, specify the file name to the `node` command, for example `node index.js`.

## The `global` Object

The Node environment contains a number of Node-specific global elements. Every Node-specific global property sits inside the Node `global` object. This object contains a number of useful properties and methods that are available anywhere in the Node environment. `Window` is the equivalent to `global`, but for the browser.

## Core Modules

**Module** : a collection of code located in a file.

**Core Modules** : (built-in modules) are modules provided by Node.js to perform common tasks efficiently. These modules are part of Node's source code and reside in the **lib/** folder. Since they are built-in, you do not need to install them using a package manager like npm.

### CommonJS Modules

In **CommonJS**, core modules can be loaded using the `require()` function. You pass the module’s name as a string, and Node.js will return the module object for you to use.

Example using the `fs` (File System) module:

```js
const fs = require("fs");

fs.readFile("./file.txt", "utf8", (err, data) => console.log(data));
```

You can also get a full list of available core modules by requiring the `module` module:

```cjs
// Returns an array of all core modules
const modules = require("module").builtinModules;
console.log(modules);
```

### ES Modules

In **ES Modules** (ECMAScript modules), you use the `import` statement to bring in core modules. To enable ES Modules in Node.js, you can either: (1) use the `.mjs` file extension, (2) set `"type": "module"` in your `package.json`.

```js
import fs from "fs";
```

### The Console Module

The built-in `console` global module, provides methods such as:

- `console.log()` — print messages to the terminal.
- `console.assert()` — print a message to the terminal if the value is falsy.
- `console.table()` — print out a table in the terminal from an object or array.

Because `console` is a global module, it can be accessed from anywhere, the `require` function is not necessary.

## Implementing Modules in Node

In Node.js, each file is treated as a separate module. There are two main ways to work with modules in Node.js: **CommonJS** and **ES modules**.

### CommonJS: `require` / `module.exports`

In **CommonJS** (the default module system in Node.js), each file is treated as a separate module, and the `module.exports` property is used to expose functions or objects from one module to another.

```cjs
// addTwo.cjs
const addTwo = (num) => num + 2;

module.exports.addTwo = addTwo;
```

In this example, the function `addTwo` is added to the `module.exports object`, making it available to other files.

To import and use the function in another module, use the `require()` function:

```cjs
// index.cjs
const { addTwo } = require("./addTwo.cjs");

addTwo(3);
```

n **CommonJS**, `require()` is used to load modules **synchronously**, making the exported functions or objects from one file available to others.

### ES Modules: `import` / `export`

In **ES modules** (ECMAScript modules), which are natively supported in Node.js starting from version 12 with the `.mjs` extension or by setting `"type": "module"` in `package.json`, you use `import` and `export` to manage modules.

```mjs
// addTwo.mjs
const addTwo = (num) => num + 2;

export { addTwo };
```

In another file, you can import and use the exported function:

```mjs
// index.mjs
import { addTwo } from "./addTwo.mjs";

addTwo(3);
```

Unlike CommonJS, ES modules are imported **asynchronously** using the import statement.

## What is REPL

**REPL** (read-eval-print loop) is a program that loops through three different states: a **read** state where the program reads input from the user, the **eval** state where the program evaluates the user's input, and the **print** state where the program prints out its evaluation to the console. Then it **loops** through these states again.
