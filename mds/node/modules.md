# Modules in Node.js

## Table of Contents

- [Core Modules](#core-modules)
  - [CommonJS Modules](#commonjs-modules)
  - [ES Modules](#es-modules)
  - [The Console Module](#the-console-module)
- [Implementing Modules in Node](#implementing-modules-in-node)
  - [CommonJS: `require` / `module.exports`](#commonjs-require--moduleexports)
  - [ES Modules: `import` / `export`](#es-modules-import--export)
- [The `global` Object](#the-global-object)

## Core Modules

**Module** : reusable code located in a file that can be exported and then imported for use in another file (_separation of concerns_).

**Core Modules** : (built-in modules) are modules provided by Node.js to perform common tasks efficiently. These modules are part of Node's source code and reside in the **lib/** folder.

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

## The `global` Object

The Node environment contains a number of Node-specific global elements. Every Node-specific global property sits inside the Node `global` object. This object contains a number of useful properties and methods that are available anywhere in the Node environment. `Window` is the equivalent to `global`, but for the browser.
