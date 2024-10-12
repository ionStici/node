# Introduction to Guards in NestJS

**Guards**: NestJS feature used to **approve or deny** requests based on certain conditions.

## Table of Contents

- [What Are Guards](#what-are-guards)
- [Use Case: Access Token Guard](#use-case-access-token-guard)
- [Applying Guards](#applying-guards)
  - [Example: Applying Guards](#example-applying-guards)
- [Purpose of Guards](#purpose-of-guards)
- [How Do Guards Work?](#how-do-guards-work)
- [Conclusion](#conclusion)

## What Are Guards

- **Guards** are a **schematic** in NestJS that act as a middleware layer. Their main function is to control whether a request should be **processed** or **denied**.
- Guards are often used for **authorization** and **authentication** purposes, making sure users are allowed to access certain routes.
- A guard can either: (1) **Allow** the request to proceed, or (2) **Reject** the request and throw an appropriate exception (e.g. Unauthorized).

## Use Case: Access Token Guard

The **Access Token Guard** will ensure that:

- The request contains a valid **JWT token**.
- The user is **authorized** to access the requested route.

If the **JWT token** is missing or invalid, the guard will deny access by throwing an **Unauthorized Exception**.

## Applying Guards

Guards can be applied at different levels:

1. **Controller Level:** The guard is applied to all the routes within the controller.
2. **Method Level:** The guard is applied to individual methods (endpoints) within the controller.
3. **Global Level:** The guard can be applied to the entire application.

You can control where and how the guard is applied using the `@UseGuard()` decorator.

### Example: Applying Guards

```ts
import { Controller, Get, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "./guards/access-token.guard";

@Controller("users")
@UseGuards(AccessTokenGuard) // Guard applied to all methods
export class UsersController {
  @Get()
  @UseGuards(AccessTokenGuard) // Guard applied only to this method
  findUser() {}
}
```

This example shows how to apply a guard to the entire controller or to a specific method within the controller.

The `@UseGuards()` receives as parameter the guard `AccessTokenGuard` that will verify if the request can proceed.

## Purpose of Guards

- **Authentication:** Guards can check if the request includes a valid JWT token for authentication.
- **Authorization:** Guards can ensure that the user has the necessary permissions (e.g. roles) to access certain resources.
- **Custom Conditions:** You can implement any custom logic in a guard, for example, checking whether a user's account is active before allowing them to proceed.

## How Do Guards Work?

1. **Request is made:** The user sends a request to a protected route.
2. **Guard activates:** The guard intercepts the request and checks for the presence of a **JWT token** (or any other condition you define).
3. **Validate Token:** The guard validates the JWT token. If it's valid, the request is allowed to proceed.
4. **Reject Request:** If the token is invalid or missing, the guard throws an exception, rejecting the request.

## Conclusion

- **Guards** in NestJS are essential for managing **access control** in your application.
- They ensure that only authorized users with valid tokens can access specific routes.
- We use the `@UseGuards()` decorator to apply guards at different levels (controller, method, global).
