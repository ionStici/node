# Pipes in NestJS

## Table of Contents

- [Introduction](#introduction)
- [Request-Response Lifecycle](#request-response-lifecycle)
- [What are Pipes?](#what-are-pipes)
- [Purpose of Pipes](#purpose-of-pipes)
- [Types of Pipes in NestJS](#types-of-pipes-in-nestjs)
  - [Built-in Pipes](#built-in-pipes)
  - [Custom Pipes](#custom-pipes)
- [Built-in `ParseIntPipe`](#built-in-parseintpipe)
- [Validating Query Params with `DefaultValuePipe`](#validating-query-params-with-defaultvaluepipe)
- [Conclusion](#conclusion)

## Introduction

**Pipes** are essential components in NestJS that transform and validate incoming data before it reaches the controller. They ensure the data entering the system is correctly formatted and valid, enhancing security and robustness.

## Request-Response Lifecycle

In NestJS, incoming requests pass through several layers of components before reaching the controller, and the response also follows a similar path on its way back to the client. These components include:

1. **Middleware:** The first layer that processes the request, handling tasks like logging or authentication.
2. **Filters (Start):** Handle exceptions and define error boundaries. If any exception occurs within the boundary, NestJS automatically throws as error.
3. **Guards:** Define authorization rules to control access to routes.
4. **Interceptors (First Phase):** Intercept and modify requests before reaching the controller.
5. **Pipes:** Validate and transform incoming data just before the controller processes the request.
6. **Controller:** Receives the request and handles the business logic.
7. **Interceptors (Second Phase):** Intercepts and modify responses before sending them back.
8. **Filters (End):** Final error handling before the response is returned to the client.

## What are Pipes?

_Pipes perform two key tasks in NestJS:_

1. **Validation:** Ensures that incoming requests meet the criteria you’ve defined (e.g., data types, required fields). If validation fails, an error is thrown, preventing the request from reaching the controller.
2. **Transformation:** Converts incoming data into the required format. For example, transforming a string into a number before it reaches the controller.

## Purpose of Pipes

The goal of using pipes is to ensure that the request data is in the expected format before it reaches the controller. If the data does not meet the required criteria, pipes will handle validation errors, keeping faulty data from reaching the application logic.

## Types of Pipes in NestJS

### Built-in Pipes

- Built-in Pipes are predefined pipes provided by NestJS, available from the `@nestjs/common` package.
- There are [**9 built-in pipes**](https://docs.nestjs.com/pipes#built-in-pipes), each designed for specific validation and transformation tasks.

### Custom Pipes

- Developers can create custom pipes to implement more complex validation or transformation logic specific to their application.
- These are useful when the built-in pipes are not enough to handle certain requirements.

## Built-in `ParseIntPipe`

By default, **route parameters** and **query parameters** in NestJS are received as strings. To validate and transform these parameters (e.g., converting a string to an integer), you can use the `ParseIntPipe`.

```ts
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get("/:id")
  public getUsers(@Param("id", ParseIntPipe) id: number | undefined) {
    console.log(id);
  }
}
```

- `ParseIntPipe` : **built-in pipe** that converts a parameter into an integer.

- `@Param("id", ParseIntPipe)` : the `ParseIntPipe` pipe is applied to the `id` parameter. This ensures the `id` is validated and transformed into a number before reaching the controller method.

- **Validation and Transformation:** If the `id` cannot be converted into an integer (e.g., it's a string like `'abc'`), NestJS automatically throws a **Bad Request** error.

- If `id` is `'123'`, the ParseIntPipe will transform it into the number `123`.

- If the `id` is `'abc'`, it will result in a validation error.

- **Optional Parameters:** Even if the `id` is marked as optional (e.g., `/:id?`), pipes like `ParseIntPipe` will assume that the parameter is required, unless explicitly handled using more advanced techniques like **DTOs**.

- **Automatic Error Handling:** NestJS automatically manages validation errors, so you don’t need to write custom error-handling code for data type validation.

## Validating Query Params with `DefaultValuePipe`

You can also validate and transform **query parameters** with the `ParseIntPipe`, and assign default values using the `DefaultValuePipe`.

```ts
import { Controller, Get, Param, ParseIntPipe, DefaultValuePipe } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get("/:id")
  public getUsers(
    @Param("id", ParseIntPipe) id: number | undefined,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number
  ) {
    console.log(id, limit, page);
  }
}
```

- `DefaultValuePipe` : Used to assign default values to `limit` and `page` if they are not provided in the request.

- `ParseIntPipe` : Transforms and validates the `limit` and `page` query parameters.

- If the request does not include the `limit` or `page` query parameters, the default values are automatically applied.

- If invalid values (e.g., non-integer strings) are passed, validation fails, and NestJS throws an error.

## Conclusion

Pipes in NestJS provide an efficient way to **validate** and **transform** incoming data, ensuring it meets the expected format before it reaches the controller. With **built-in pipes** like `ParseIntPipe` and `DefaultValuePipe`, you can easily handle route parameters and query parameters. For more complex scenarios, like validating large request bodies, **custom pipes** or **DTOs** can be created to ensure data integrity. By using pipes, you streamline validation, reduce boilerplate code, and improve the overall robustness of your application.
