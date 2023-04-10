[&larr; Back](./README.md)

# Node Package Manager

## Dependencies

**Core modules:** Node built-in modules.

**Third-party modules:** (referred to as _dependencies_) are modules that other developers created and that are available for us to include in our code to solve common problems.

<br>

## Package Management

**Dependencies** are installed in **packages** (_third-party modules_) handled by a **package manager**.

Recommended package manager: **NPM** or _Node Package Manager_ is a command-line tool that developers use to download and manage packages via the terminal.

<br>

## Using NPM

Initiate npm with `npm init -y`

A `package.json` file will be generated with [information about the project](https://docs.npmjs.com/cli/v7/configuring-npm/package-json) in a JSON format.

<br>

### Installing

There are over 1 million of packages created by developers in the [npm](https://www.npmjs.com/) registry.

To install a package run the command `npm i package-name`

- This command installs a package locally in a folder called `node_modules`
- The newly installed packages will be added to the `package.json` file as a reference

Note: `i` is an alias for `install`

<br>

### dependencies

```json
"dependencies": { "express": "^4.17.1" }
```

- The `dependencies` field lists all the project's dependencies and their version numbers.
- `dependencies` is for packages that provide code functionality for our applications.
- `npm i express --save` use the 'save' flag to indicate that the installing package is a dependency.

<br>

### devDependencies

```json
"devDependencies": { "sass": "^1.59.3" }
```

- `devDependencies` field is for _development dependencies_ that are used during the development phase.
- `npm i sass -D` use the `-D` flag to save the pacakge as a dev dependency.

A package being a dev dependency indicates that the package is being used specifically for development and will not be included in a production release of the project.

Note: `-D` is an alias for `--save-dev`

<br>

### npm install

The `package.json` file helps us collaborate effectively with other developers.

```
npm i
npm i --production
```

Running this comand will automatically install all packages listed as dependencies or dev dependencies.

The `--production` flag will leave out development dependencies.

Conclusion: when sharing your code, do not include the `node_modules` folder.

<br>

## Global Packages

Some packages can be installed **globally** (available system-wide).

Global packages remove the need to install it each time you create a new app.

To install a package globally, use the `-g` flag with the install command.

```
npm install live-server -g
```

Packages installed globally will be stored in a separate global `node_modules/` folder.

<br>
