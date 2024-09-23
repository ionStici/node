# Express Routes and HTTP Methods

## Table of Contents

- [Introduction to Express](#introduction-to-express)
- [Routes and Responses](#routes-and-responses)
- [Matching Route Paths](#matching-route-paths)
- [Dynamic Route Parameters in Express](#dynamic-route-parameters-in-express)
- [Setting Status Codes in Express](#setting-status-codes-in-express)
- [HTTP Methods in Express](#http-methods-in-express)
- [Query Strings in Express](#query-strings-in-express)
- [Creating Resources with POST in Express](#creating-resources-with-post-in-express)
- [Deleting Resources with DELETE in Express](#deleting-resources-with-delete-in-express)
- [Express CRUD Code Example](#express-crud-code-example)
- [Using Express Routers](#using-express-routers)
- [Using Multiple Router Files in Express](#using-multiple-router-files-in-express)

## Introduction to Express

[**Express**](https://expressjs.com) is a fast and flexible server-side Node.js framework for building web servers and APIs.

### Installation

```bash
npm install express --save
```

### Basic Setup

```js
import express from "express";
const app = express();
```

To create a server, invoke the `express` function. This returns an instance of an Express application, which you can use to define server behavior and handle requests.

The role of a server is to listen for incoming requests, perform actions based on those requests, and send back a response.

To enable the server to start listening for requests, you must specify a port number with the `app.listen()` method.

```js
const PORT = 8000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
```

The `app.listen()` method starts the server on the given port. The callback function runs once the server is up and running.

## Routes and Responses

Routes define how the server handles requests based on the request's path and HTTP method. For example, if the server receives a `GET` request at `/login`, you need to implement logic that matches both the HTTP method and the path.

`GET` requests are typically used to retrieve resources from a server and are the default method when accessing a URL.

In Express, you register routes for `GET` requests using `app.get()`. It takes two arguments: (1) the route's path (a string), (2) a callback to handle the request and send a response.

The below route handles any `GET` request to `/contact`, invoking the callback function with the request `req` and response `res` objects.

```js
app.get("/contact", (req, res, next) => {
  res.send("Hello World");
});
```

Express servers send responses using the `.send()` method on the response object. This method will take any input and include it in the response body.

## Matching Route Paths

Express matches requests to routes in the order they are registered. When a request is made to `<server address>:<port>/api-endpoint`, the server checks each route sequentially. The first matching route will have its callback executed.

For example, if two `GET` routes are registered for `/home` and `/contact` - a `GET /contact` request first checks `/home`, and since it doesn't match, Express moves to the next `/contact` route, and calls its callback.

If no routes match or no response is sent, Express will automatically return a 404 Not Found.

## Dynamic Route Parameters in Express

Express supports dynamic routes using named parameters, which are defined with `:` in the route path. These parameters act as wildcards, matching any value for that segment. For instance, `/products/:id` matches both `/products/123` and `/products/456`.

Route parameters are accessible in `req.params` object, where the keys represent the parameter names, and the values are the actual data from the request.

```js
const products = { laptop: { price: 1200, stock: 30 }, phone: { price: 800, stock: 50 } };

app.get("/products/:item", (req, res) => {
  const product = products[req.params.item];
  res.send(product);
});
```

## Setting Status Codes in Express

Express allows setting custom status codes on responses before they are sent. Status codes inform clients about the result of their requests. By default, methods like `res.send()` send a `200 OK` status unless otherwise specified.

You can set a status code using `res.status()`, which can be chained with other methods like `res.send()`.

```js
app.get("/products/:item", (req, res) => {
  const product = products[req.params.item];

  if (product !== undefined) {
    res.send(product);
  } else res.status(400).send("Product not found");
});
```

In this example, if no product was found, a `404 Not Found` status is sent with a custom message.

## HTTP Methods in Express

The HTTP protocol defines various methods. Essential HTTP methods include `GET`, `PUT`, `POST`, `DELETE`, which are provided in Express via `app.get()`, `app.put()`, `app.post()`, `app.delete()`.

- `GET` to retrieve data.
- `POST` to add a new resource.
- `PUT` requests update existing resources.
- `DELETE` to delete a specified resource.

These methods align with the **CRUD operations**: `POST` creates new data (**C**reate), `GET` retrieves data (**R**ead), `PUT` updates existing data (**U**pdate), `DELETE` removes data (**D**elete).

## Query Strings in Express

Query strings are additional information attached to a URL after a `?` character. They don't count as part of the path but are parsed into an object called `req.query`.

For example, in the URL `/product/1?name=phone&price=700`, the `req.query` object would return `{ name: 'phone', price: '700' }`.

```js
app.put("/product/:id", (req, res) => {
  const productUpdates = req.query;
  products[req.params.id] = productUpdates;
  res.send(products[req.params.id]);
});
```

In this example, a `PUT /product/1?name=phone&price=700` request updates `products[1]` object with the new data from `req.query`. After the update, the modified item is sent back in the response to ensure the client has the latest version.

## Creating Resources with POST in Express

The `POST` method is used to create new resources. For example, a client makes a `POST /products` request to create a new product. The server generates the new resource and returns it.

```js
app.post("/products", (req, res) => {
  const newProduct = createElement("products", req.query);
  products.push(newProduct);
  res.status(201).send(newProduct);
});
```

In this example, the `POST` route adds a new product from the `req.query` data and sends back the new resource with a `201 Created` status code, which is the standard response for newly created resources.

## Deleting Resources with DELETE in Express

The `DELETE` method is used to remove existing resources. Typically, `DELETE` routes include a route parameter to specify which resource to delete.

```js
app.delete("/products/:id", (req, res) => {
  const index = getIndexById(req.params.id, products);

  if (index !== -1) {
    products.splice(index, 1);
    res.status(204).send(); // 204 No Content - indicates successful deletion
  } else P;
  res.status(404).send("Product not found");
});
```

In this example, the server finds the resource by its ID, removes it using `splice()`, and returns a `204 No Content` status on successful deletion. If the resource isn't found, a `404 Not Found` status is sent.

## Express CRUD Code Example

```js
import express from "express";
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

let items = []; // In-memory storage (would be a database in real-world apps)

// 1. CREATE - POST request
app.post("/items", (req, res) => {
  const newItem = { id: items.length + 1, name: req.body.name };
  items.push(newItem);
  res.status(201).send(newItem);
});

// 2. READ - GET request to fetch all items
app.get("/items", (req, res) => {
  res.send(items);
});

// 2.1. READ - GET request to fetch item by ID
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send("Item not found");

  res.send(item);
});

// 3. UPDATE - PUT request to update an existing item
app.put("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) res.status(404).send("Item not found");

  item.name = req.body.name;
  res.send(item);
});

// 4. DELETE - DELETE request to remove an item
app.delete("/items/:id", (req, res) => {
  const itemIndex = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (itemIndex === -1) return res.status(404).send("Item not found");

  items.splice(itemIndex, 1);
  res.status(204).send();
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```

1. **CREATE (POST `/items`):**

   The client sends a `POST` request with the new item data (name) in the request body. The server generates a new item with a unique ID, adds it to the list, and responds with the created item and a `201 Created` status code.

2. **READ (GET `/items`):**

   This route handles fetching all items. The server responds with the list of all stored items.

3. **READ (GET `/items/:id`):**

   This route fetches a single item by its ID from the request URL. If the item is found, it is returned; otherwise, the server sends a `404 Not Found` status.

4. **UPDATE (PUT `/items/:id`):**

   The client sends updated data for an existing item using a `PUT` request. The server looks up the item by its ID and updates its fields with the new data. The updated item is then sent back in the response.

5. **DELETE (DELETE `/items/:id`):**

   The server deletes an item by its ID when a `DELETE` request is made. It responds with a `204 No Content` status, indicating successful deletion without returning any content.

## Using Express Routers

**Express Routers** allow you to organize and manage different routes in your application, enabling a modular structure that helps separate route handling logic into smaller, more manageable components.

An Express Router provides a way to create modular and flexible route handling.

You can create a router instance by calling `express.Router()`, and then mount it on a specific path using `app.use()`.

```js
const productsRouter = express.Router();
app.use("/products", productsRouter);

productsRouter.get("/:id", (req, res) => {});
```

_How it works:_

- The `productsRouter` handles routes starting with `/products`. For example, `productsRouter.get("/:id")` matches the full path `/products/:id`.

- When a `GET /products/1` request arrives, the `/products` path is matched by `app.use()`, and Express looks into the router for further path matching.

## Using Multiple Router Files in Express

To keep the code modular and manageable, it's common practice to place each router in its own file. This keeps the main application file clean and organized.

```js
// items.js
import express from "express";

const itemsRouter = express.Router();

const items = [];

itemsRouter.get("/:id", (req, res) => {
  const item = items[req.params.id];

  if (item) {
    res.send(item);
  } else {
    res.status(404).send("Not Found");
  }
});

export { itemsRouter };
```

```js
// index.js
import express from "express";
import { itemsRouter } from "./itemsRouter";

const app = express();

app.use("/items", itemsRouter);
```
