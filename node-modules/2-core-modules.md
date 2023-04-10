[&larr; Back](./README.md)

# Core Modules

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
