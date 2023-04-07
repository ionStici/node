# Streams

## Table of Content

- [Introduction](#introduction)
- [Readable Streams using readline module](#readable-streams-using-readline-module)

## Introduction

A **stream** represents a continuous flow of data

In practice, it allows you to read or write data efficiently in chunks instead of loading the entire data into memory. Streams are especially useful when working with large files.

Four types of streams in node.js:

1. **Readable** - a stream from which data can be read (e.g. reading a file).
2. **Writable** - a stream to which data can be written (e.g. writing to a file).
3. **Duplex** - a stream that is both readable and writable (e.g. a TCP socket).
4. **Transform** - a duplex stream that performs a transformation on the data as it is read and written (e.g. data compression).

Streams in Node.js are instances of the `EventEmitter` class, and they emit events such as `data` `end` `error` `finish`, which signal varios stages of the data flow.

<br>

## Readable Streams using readline module

- With `readFile` we can read content of entire files.
- Using `readline` module we can read files sequentially line-by-line.

<div></div>

- Practice known as a **stream**: Processing data sequentially, pece by piece.
- Streaming data is often the preferable method as it consumes less RAM.

### readline

Reading and writing files line-by-line, using the `createInterface()` method from the `leadline` core module.

`createInterface()` returns an `EventEmitter` set up to emit `line` events.

```js
const readline = require("readline");
const fs = require("fs");

const interface = readline.createInterface({
  input: fs.createReadStream("text.txt"),
});

interface.on("line", (fileLine) => console.log(fileLine));
```

1. `readline.createInterface()` with an object containin the `input`, will return an interface.
2. We set `input` to `fs.createReadStream("text.txt")` which will create a stream from the `text.txt` file.
3. On the created interface, we attach a `line` event along with a callback. A `line` event will be emitted after each line from the file is read.
4. For each line that `text.txt` file has, a `line` event will be emitted, and the `fileLine` parameter will contain the content from each line.

<br>

## Writeable Streams

<br>