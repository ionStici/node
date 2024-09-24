# Controllers

A **controller** in an application handles all routing logic. Its main function is to receive incoming requests and determine which method to trigger based on the request type (e.g., GET, POST, DELETE). Each request type has its own method within the controller to process it. Thus, a controller processes various request methods through specific functions.

## Table of Contents

- [Creating Controllers](#creating-controllers)
  - [Creating a Controller using NestJS CLI](#creating-a-controller-using-nestjs-cli)
  - [Registering the Controller](#registering-the-controller)
- [Using HTTP Methods](#using-http-methods)
  - [How the Decorators Work](#how-the-decorators-work)
  - [Testing the Endpoints using httpYac](#testing-the-endpoints-using-httpyac)
- [`Params` and `Query` in NestJS Controllers](#params-and-query-in-nestjs-controllers)
- [Request Body, Headers, Ip](#request-body-headers-ip)
- [Providers](#providers)

## Creating Controllers

```ts
// users/users.controller.ts
import { Controller } from "@nestjs/common";

// http://localhost:3000/users
@Controller("users")
export class UsersController {}
```

- `@Controller('users')` : decorator used to define the `UsersController` controller that will handle incoming HTTP requests.

- The `'users'` string defines the base route for this controller. Requests to this controller will follow this endpoint: `http://localhost:3000/users`

### Creating a Controller using NestJS CLI

```bash
nest generate controller users --no-spec
```

### Registering the Controller

```ts
// users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersController } from "./users/users.controller";

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
```

## Using HTTP Methods

- `@Controller("users")` : All the HTTP methods inside the `UsersController` will be appended to the `'users'` base path.

- `@Get`, `@Post`, `@Patch`, `@Put`, `@Delete` : HTTP decorators for defining HTTP endpoints for handling requests.

```ts
import { Controller, Get, Post, Patch, Put, Delete } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  public getUsers() {
    return "Get Request";
  }

  @Post()
  public createUsers() {
    return "Post Request";
  }

  @Patch()
  public updateUser() {
    return "Patch Request";
  }

  @Put()
  public updatePassword() {
    return "Put Request";
  }

  @Delete()
  public deleteUser() {
    return "Delete Request";
  }
}
```

- `@Get` : creates a GET endpoint for the `/users` route. When a client sends a GET request to `/users`, the `getUsers` method is executed.
- `@Post` : creates a POST endpoint.
- `@Patch` : creates a PATCH endpoint.
- `@Put` : Creates a PUT endpoint
- `@Delete` : Creates a DELETE endpoint.

NestJS uses Express.js under the hood for requests and responses.

### How the Decorators Work

- Each decorator maps the method in the controller to a specific HTTP request type (GET, POST, etc.).
- When the server receives a request to the `/users` route, it looks at the HTTP method (GET, POST, etc.) and directs the request to the corresponding method in the controller.

### Testing the Endpoints using httpYac

```bash
# users.get.endpoint.http | GET Request
GET http://localhost:3000/users/123/?limit=10&offset=20
```

```bash
# users.post.endpoint.http | POST Request
POST http://localhost:3000/users
Content-Type: application/json
{ "email": "john@doe.com", "password": "password123" }
```

```bash
# users.delete.endpoint.http | DELETE Request
DELETE http://localhost:3000/users
```

```bash
# users.patch.endpoint.http | PATCH Request
PATCH http://localhost:3000/users
```

```bash
# users.put.endpoint.http | PUT Request
PUT http://localhost:3000/users
```

## `Params` and `Query` in NestJS Controllers

```ts
import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get("/:id/:optional?")
  public getUsers(@Params() params: any, @Query() query: any) {
    console.log(params); // { id: '125', optional: 'admin'  }
    console.log(query); // { limit: '10', page: '2' }
  }
}
```

- `getUsers(@Param('id') id: any, @Query('limit') limit: any)` : retrieving specific params or queries.

## Request Body, Headers, Ip

```ts
import { Controller, Post, Body, Headers, Ip } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Post()
  public createUsers(@Body() request: any, @Headers() headers: any, @Ip() ip: any) {
    console.log(request);
    console.log(headers);
    console.log(ip);
  }
}
```

- `createUsers(@Body('email') email: any)` : retrieving specific properties from request body.

## Providers

**Providers** are essential components in NestJS, responsible for managing the business logic of the application. Controllers should only handle routing, leaving providers to encapsulate all non-routing functionality, such as interacting with databases, performing operations, and handling external services.

- **Definition**: Providers are additional classes in a module where business logic is written. They support controllers, which should not contain business logic.
- **Usage**: Providers handle tasks like connecting to databases, interacting with external APIs, or performing specific operations (e.g., checking a blacklist or retrieving user data from a third-party service like Gravatar).
- **Types of Providers**: Providers can come in different forms, including services, repositories, factories, or helpers, each serving specific purposes.
- **Separation of Concerns**: Providers allow for a modular code structure, making it easier to isolate and debug specific functionalities.

In summary, providers help keep controllers focused on routing by encapsulating business logic, resulting in a cleaner, more maintainable codebase.
