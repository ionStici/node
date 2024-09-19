# Node Package Manager (npm)

## Table of Contents

- [Introduction](#introduction)
- [Initialization](#initialization)
- [Installing Packages](#installing-packages)
- [Scripts in `package.json`](#scripts-in-packagejson)
- [Managing Dependencies](#managing-dependencies)
- [Installing All Dependencies](#installing-all-dependencies)
- [Global Packages](#global-packages)

## Introduction

In Node.js, **modules** are collections of code that perform specific tasks. There are two types of modules:

- **Core Modules** : Built-in modules provided by Node.js (e.g., `fs`, `path`).
- **Third-party Modules** : Also known as **dependencies**, these are modules created by other developers and shared via package registries like npm.

**Dependencies** are managed using **npm** (Node Package Manager), which is a command-line tool that helps developers install, update, and manage third-party packages.

## Initialization

To use **npm** in a Node.js project, run the command:

```bash
npm init
```

This will generate a `package.json` file, which stores [information about the project](https://docs.npmjs.com/cli/v7/configuring-npm/package-json), including its name, version, author, and most importantly, the list of project dependencies.

The `package.json` file include a `dependencies` section where npm will automatically add any packages you install, along with their version numbers.

## Installing Packages

The [npm](https://www.npmjs.com/) registry contains over a million third-party packages, making it easy for developers to find and use solutions to common problems.

For example, one popular package is [`nodemon`](https://www.npmjs.com/package/nodemon), which automatically restarts a Node.js application when file changes are detected:

```bash
npm install nodemon
```

This command will:

- Install the `nodemon` package locally in a folder called `node_modules`.
- Add `nodemon` to the `dependencies` section of your `package.json` file:

```json
"dependencies": { "nodemon": "^3.1.4" }
```

You can install any package by running `npm i package-name`

**Note**: `i` is an alias for `install`

## Scripts in `package.json`

You can define custom scripts in your `package.json` to automate common tasks. For example, you can create a `start` script to run your Node.js app using `nodemon`:

```json
"scripts": { "start": "nodemon index.js" }
```

Now, you can simply run:

```bash
npm start
```

## Managing Dependencies

### dependencies

```json
"dependencies": { "express": "^4.17.1" }
```

The `dependencies` field of `package.json` lists all the packages the application relies on to function. In other words, packages that provide code functionality.

### devDependencies

```json
"devDependencies": { "sass": "^1.59.3" }
```

`devDependencies` are packages used only during the development phase, such as testing libraries, build tools, or compilers. These packages are not needed in production environments.

`npm i sass -D` use the `-D` flag to save the package as a dev dependency.

**Note**: `-D` is an alias for `--save-dev`

## Installing All Dependencies

**Best Practice**: when sharing your code, do not include the `node_modules` folder.

The `package.json` file helps us collaborate effectively with other developers. To install all the dependencies listed in `package.json`, run:

```
npm install
```

This command will install both `dependencies` and `devDependencies` listed in the `package.json` file, ensuring that your project is properly set up.

## Global Packages

Some npm packages can be installed **globally** (available system-wide). Global installation makes it easier to use command-line tools like `nodemon` or `live-server` without needing to install them in every project.

To install a package globally, use the `-g` flag with the install command:

```
npm install live-server -g
```

Global packages are stored in a separate `node_modules/` directory that is accessible system-wide. This makes them available as command-line tools.
