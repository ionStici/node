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

- Node's `http` module allows to create and manage HTTP servers.

- The `http.createServer()` method creates a new HTTP server. This method takes a callback function that is executed every time a request is received.

  This callback function has two parameters: (1) `req` (request object) contains information about the incoming request, (2) `res` (response object) is used to send the response back to the client.

- Response Headers

## Handling POST Requests
