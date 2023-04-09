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

To install a package run the command `npm i package-name`

- This command installs a package locally in a folder called `node_modules`
- The newly installed package will be added to the `package.json` file as a reference

There are over 1 million packages created by developers in the [npm](https://www.npmjs.com/) registry.

Note: `i` is an alias for `install`

<br>

### dependencies

- The `dependencies` field lists all the project's dependencies alongside their version numbers.
- `dependencies` is for packages that provide for our applications code functionality.
- `npm i express --save` the 'save' flag indicates that the installing pacakge is a dependency.

<br>

### devDependencies

- `devDependencies` is for _development dependencies_ which are used for the purpose of making the development easier or more efficient.
- To install a package as a `devDependencies`

<br>
