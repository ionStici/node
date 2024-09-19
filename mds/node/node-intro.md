# Node.js Introduction

**Node.js** is a JavaScript runtime built on Chrome’s **V8 engine** that allows developers to execute JavaScript code on the **server side**.

A **runtime** converts code written in a high-level programming language and compiles it down to code the computer can execute.

Node is non-blocking and event-driven, making it ideal for building scalable, real-time applications.

Node.js is fast, scalable, and ideal for modern web development.

_Key Features:_

- **Asynchronous & Event-Driven**: Node.js handles many connections at once through non-blocking I/O operations.

- **Single-Threaded**: Though single-threaded, Node.js can handle thousands of concurrent connections efficiently using its **event loop** and **thread pool**.

- **NPM (Node Package Manager)**: Node.js includes npm, the world’s largest library of reusable code packages, allowing you to easily install and manage third-party libraries.

- **Cross-Platform**: It runs on major platforms such as Windows, Linux, and macOS.

_Common Use Cases:_

- **API Development**: Perfect for creating RESTful APIs and handling asynchronous operations.

- **Real-Time Applications**: Ideal for chat apps, live collaboration tools, and streaming services.

- **Microservices**: Used to build scalable microservice architectures.

## Execute JavaScript Code with Node

- **Node REPL** : Access the Node REPL by typing the command `node` in the terminal. REPL displays the return of each evaluated like. If you'd like to type multiple lines and then have them evaluated at once, type `.editor` to enter editor mode, and then press `control` + `d` for the input to be evaluated.

- **Execute File** : To execute a JavaScript file with node, specify the file name to the `node` command, for example `node index.js`.

### What is REPL

**REPL** (read-eval-print loop) is a program that loops through three different states: a **read** state where the program reads input from the user, the **eval** state where the program evaluates the user's input, and the **print** state where the program prints out its evaluation to the console. Then it **loops** through these states again.

## The `global` Object

The Node environment contains a number of Node-specific global elements. Every Node-specific global property sits inside the Node `global` object. This object contains a number of useful properties and methods that are available anywhere in the Node environment. `Window` is the equivalent to `global`, but for the browser.
