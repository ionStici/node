[&larr; Back](./README.md)

# Core Modules

**Core modules** (built-in modules) are used to perform common tasks efficiently. They are defined within Node's source code and are located in the **lib/** folder. Core modules can be required by passing a string with the name of the module into the `require()` function:

```js
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

- `console.log()` — print messages to the terminal.
- `console.assert()` — print a message to the terminal if the value is falsy.
- `console.table()` — print out a table in the terminal from an object or array.

Because `console` is a global module, it can be accessed from anywhere, the `require` function is not necessary.

<br>
