# Creating a HTTP Server in Node.js

```js
// Import the http module
import http from "http";

// Create the server
const server = http.createServer((req, res) => {
  // This function will run every time a request is made to the server

  // Set the response header with a status code and content type
  res.writeHead(200, { "Content-Type": "text/plain" });

  // Routing
  if (req.url === "/") {
    // Write a response body
    res.write("Hello, World!");
  } else if (req.url === "/about") {
    res.write("Welcome to the About Page!");
  } else {
    res.write("404 Page Not Found");
  }

  // End the response
  res.end();
});

// Tell the server to listen on port 8000
server.listen(8000, () => {
  console.log("Server running on port 8000");
});
```

```bash
node server.js
# Access the server at http://localhost:8000
```

- The `http` module allows to create and manage HTTP servers.

- The `http.createServer()` method creates a new HTTP server. This method takes a callback function that is executed every time a request is received.

  - This callback function has two parameters: (1) `req` (request object) contains information about the incoming request, (2) `res` (response object) is used to send the response back to the client.

  - This callback should contain code to handle requests and send back responses.

- The `writeHead()` method on the `res` object is for setting status codes and the content type that is being sent back.

- `res.write('Hello, World!')` this method is used to send the actual content that we want the client to receive.

- The `url` property of the `req` object contains the resource the client is requesting, and by using a simple `if` statement we can implement a basic routing logic. If not url resource matches available options, the server should return a "not found" error message.

- Once the content has been sent, we can `res.end()` to indicate that the response is complete. Without this, the client will keep waiting for more data.

- The `server.listen()` method tells the server to start listening for incoming requests on a specified port.

## Handling POST Requests

```js
import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let body = "";

    // Collect data chunks
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // When all data is received
    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write(`Received data: ${body}`);
      res.end();
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("Only POST requests are supported");
    res.end();
  }
});

server.listen(8000, () => console.log(`Listening: 8000}`));
```

- We check the request method using `req.method === 'POST'` and collect data in chunks using the data event.
- As data is received, we concatenate it into a `body` string. Once the data is fully received, we send a response with the received data.
