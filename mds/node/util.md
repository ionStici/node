# The `util` Module

The `util` module provides utility functions that help with tasks such as debugging, inspecting objects, and managing asynchronous operations. t includes several helpful tools to work more efficiently within Node.js.

1. **`util.promisify()`** : Converts a callback-based function into a Promise-based function, allowing it to work with `async` / `await`.

```js
import { promisify } from "util";
import fs from "fs";

const readFile = promisify(fs.readFile);

async function readFileContent() {
  try {
    const data = await readFile("file.txt", "utf-8");
  } catch (err) {
    console.log(err);
  }
}
```

2. **`util.types()`** : Provides various type-checking functions to verify specific data types.

```js
import util from "util";
util.types.isPromise(Promise.resolve()); // true
```
