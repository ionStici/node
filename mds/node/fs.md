# The `fs` Module

The `fs` (File System) module in Node.js provides an API for interactive with the file system, allowing you to read, write, delete, and manipulate files and directories.

1. **`fs.readFile()`** : Asynchronously reads the contents of a file.

```js
fs.readFile("file.txt", "utf-8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

2. **`fs.writeFile()`** : Asynchronously writes data to a file, replacing it if it exists.

```js
fs.writeFile("file.txt", "Hello World", (err) => {
  if (err) throw err;
});
```

3. **`fs.appendFile()`** : Appends data to a file, creating it if it doesn't exist.

```js
fs.appendFile("file.txt", "New Content", (err) => {
  if (err) throw err;
});
```

4. **`fs.unlink()`** : Deletes a file.

```js
fs.unlink("file.txt", (err) => {
  if (err) throw err;
});
```

5. **`fs.readdir()`** : Reads the contents of a directory.

```js
fs.readdir("./", (err, files) => {
  if (err) throw err;
  console.log(files);
});
```

6. **`fs.stat()`** : Retrieves information about a file (e.g. size, creation date).

```js
fs.stat("file.txt", (err, stats) => {
  if (err) throw err;
  console.log(stats);
});
```

These functions have **synchronous** versions (e.g., `fs.readFileSync()`), but the asynchronous versions are preferred to avoid blocking the event loop. The `fs` module is essential for working with files and directories in Node.js.
