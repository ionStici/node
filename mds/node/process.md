# The `process` and `os` modules

## The `process` Modules

In computer science, a **process** is an instance of a running program that is being executed by the OS. The global node [`process`](https://nodejs.org/api/process.html) object represents the current Node process, it provides information and control over the current process.

- `process.env` - an object containing the environment variables of the current node process (e.g. `PWD`, `PATH`, `USER`).

- `process.argv` - an array containing command-line arguments passed when the current process was initiated.

- `process.memoryUsage()` - returns information about the CPU demands of the current process.

- `process.cwd()` - returns the current working directory.

- `process.pid` - returns the process ID of the current node.js process.

- `process.versions` - returns an object containing versions of the Node.js runtime and its dependencies, such as V8, OpenSSL, and others.

## Environment Variables

[dotenv](https://www.npmjs.com/package/dotenv) is a module for loading environment variables from `.env` files into `process.env`.

```bash
npm install dotenv --save
```

```js
import "dotenv/config";

process.env.API_KEY;
```

## The OS Module

```js
import os from "os";

const local = {
  "Operating System": os.type(), // computer's operating system
  "CPU architecture": os.arch(), // operating system CPU architecture
  "Network Interfaces": os.networkInterfaces(), // network interfaces (IP / MAC)
  "Home Directory": os.homedir(), // current user's home directory
  Hostname: os.hostname(), // the hostname of the operating system
  "Last Reboot": os.uptime(), //the system uptime (in seconds)
};
```
