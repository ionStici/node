# Express Routing

## Introduction

**Express Routers** allow you to organize and manage different routes in your application, enabling a modular structure that helps separate route handling logic into smaller, more manageable components.

## Using Express Routes

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
