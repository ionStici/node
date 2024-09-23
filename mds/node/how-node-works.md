# About Node.js

## Table of Contents

- [1. How Node.js Works Behind the Scenes](#1-how-nodejs-works-behind-the-scenes)
- [2. Processes, Threads, and the Thread Pool](#2-processes-threads-and-the-thread-pool)
- [3. The Node.js Event Loop](#3-the-nodejs-event-loop)
- [4. Events and Event-driven Architecture](#4-events-and-event-driven-architecture)
- [5. Streams](#5-streams)
- [6. Non-blocking I/O in Node.js](#6-non-blocking-io-in-nodejs)

## 1. How Node.js Works Behind the Scenes

Node.js is built on top of Google's V8 engine, which converts JavaScript into machine code, enabling server-side JavaScript execution. While most backend environments (like Java, PHP) are multithreaded, Node.js operates in a **single-threaded**, non-blocking model to handle many connections at once. This makes it highly scalable for I/O-intensive tasks, such as APIs and real-time applications.

_Key Elements:_

- **V8 Engine:** Compiles JavaScript into machine code.
- **libuv:** Provides the asynchronous, non-blocking I/O operations and manages threads, the event loop, and the thread pool.

## 2. Processes, Threads, and the Thread Pool

In computing, a **process** is an instance of a program running in memory, while a **thread** is a sequence of instructions executed by a process. Node.js uses a single thread to handle most tasks but uses a **thread pool** (via **libov**) for heavy or blocking operations.

_Breakdown:_

- **Single Threaded:** Node.js itself runs in a single thread, executing JavaScript code.
- **Thread Pool:** When Node.js encounters I/O-heavy tasks like file access, cryptography, or compression, it offloads these tasks to a thread pool (managed by `libov`), which consists of multiple threads to prevent blocking the main thread.

_Example:_

When you read a file using `fs.readFile()`, the task is sent to the thread pool, and Node.js can continue processing other requests while the file is being read in a separate thread.

### Threads Clarification

Node.js is **single-threaded** because the **main event loop** runs on a single thread. This thread handles most of the JavaScript execution and asynchronous tasks like handling requests.

However, for **I/O-intensive** tasks (e.g., file system operations, networking, or cryptography), Node.js uses a **thread pool** (via `libuv`) to offload these heavy tasks to separate background threads. These background threads allow Node.js to perform multiple operations concurrently without blocking the main event loop.

So, while Node.js has a **thread pool** for handling specific operations, its core JavaScript execution remains single-threaded.

## 3. The Node.js Event Loop

The **event loop** is the core mechanism that allows Node.js to handle asynchronous, non-blocking operations. It enables Node to perform I/O operations without blocking the main thread.

_Event Loop Phases:_

1. **Timers:** Executes callbacks from `setTimeout()` and `setInterval()`
2. **I/O Callbacks:** Handles I/O-related tasks like network requests and file I/O
3. **Idle/Prepare:** Internal phase used by Node.js
4. **Poll:** Retrieves new I/O events, executing I/O-related callbacks
5. **Check:** Executes `setImmediate()` callbacks.
6. **Close Callbacks:** Handles closing events like WebSocket or TCP connections closures.

The event loop operates in cycles called **ticks**. It continuously checks for pending tasks, executes them, and moves to the next tick, making Node.js efficient at handling many concurrent connections.

## 4. Events and Event-driven Architecture

Node.js operates on an **event-driven architecture**. Instead of waiting for a task to complete (like file reading or an HTTP request), Node.js registers a callback function and moves on to the next task. Once the event (like a file read) is completed, Node triggers the callback.

_Key Points:_

- **`EventEmitter` Class:** Central to Node’s event system. It allows objects to emit events and listen for them.

```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

// Register an event listener
emitter.on("greet", () => {
  console.log("Hello there!");
});

// Emit the event
emitter.emit("greet");
```

This event-driven, non-blocking approach is the reason Node.js can handle thousands of requests without creating multiple threads.

## 5. Streams

**Streams** are Node’s way of handling I/O efficiently by processing data piece by piece, rather than waiting for the entire data set to be available. This is particularly useful for large files or network requests.

_Types of Streams:_

- **Readable Streams:** Used to read data (e.g., reading a file or network response).
- **Writable Streams:** Used to write data (e.g., writing to a file).
- **Duplex Streams:** Both readable and writable (e.g., TCP sockets).
- **Transform Streams:** Modifies or transforms data while reading or writing (e.g., compressing a file).

```js
const fs = require("fs");

// Reading a file using streams
const readable = fs.createReadStream("example.txt");

readable.on("data", (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

Streams are crucial for performance, especially in large data transfers, as they prevent memory overload by processing data incrementally.

## 6. Non-blocking I/O in Node.js

**I/O (Input/Output)** refers to the communication between a system (like a computer or program) and the external world (which can be a user, file system, network, etc.). In computing, **Input** is data received by the system (e.g., reading a file, receiving a network request), and **Output** is data sent from the system (e.g., writing to a file, sending a response).

In **Node.js, I/O** refers to operations that involves external resources like:

- **File system I/O:** Reading/writing files.
- **Network I/O:** Handling HTTP requests, database queries, or socket communication.

One of Node.js's biggest advantages is its ability to perform **non-blocking I/O**. Instead of waiting for I/O operations (e.g., file reads, database queries) to complete, Node.js registers a callback and moves on, allowing other operations to proceed.

Node.js is optimized for handling **non-blocking I/O**. This means that instead of waiting for I/O operations (like reading a file) to complete, Node.js immediately moves on to the next task and processes the I/O results when they are ready (using callbacks, promises, or async/await). This allows Node.js to handle many I/O operations concurrently, making it highly efficient for I/O-heavy applications.
