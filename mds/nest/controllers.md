# NestJS Controllers

## Table of Contents

- [HTTP Decorators](#http-decorators)
- [Param and Query in NestJS Controllers](#param-and-query-in-nestjs-controllers)
- [Request Body, Headers, Ip in NestJS Controllers](#request-body-headers-ip-in-nestjs-controllers)

## HTTP Decorators

A **controller** handles the routing logic, its main responsibility is to receive incoming requests and determine which method to trigger based on the request type.

```ts
// users/users.controller.ts
import { Controller, Get, Post, Patch, Put, Delete } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Post()
  createUser() {
    return "Post Request";
  }
}
```

- `@Controller('users')` : Empowers a class to handle HTTP requests. All the HTTP methods inside `UsersController` will be appended to the `'users'` base path.

- `@Get`, `@Post`, `@Patch`, `@Put`, `@Delete` : Decorators for creating HTTP endpoints. Each decorator maps its method in the controller to a specific HTTP request type (GET, POST, etc.).

```bash
# Create a Controller using NestJS CLI
nest generate controller users --no-spec
```

## Param and Query in NestJS Controllers

```ts
// GET http://localhost:3000/posts/get/10/test/?limit=10&view=portrait
import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("posts")
export class PostsController {
  @Get("/get/:id/:optional?")
  public getPost(@Param() params: any, @Query() queries: any) {
    console.log(params); // { id: '10', optional: 'test' }
    console.log(queries); // { limit: '10', view: 'portrait' }
  }
}
```

- `@Get("/get/:id/:optional?")` : GET route, with an additional `/get` segment, `/:id` required dynamic parameter, `/:optional?` optional param.

- `@Param() params: any` : Used to capture **dynamic parameters** from the URL.

- `@Query() queries: any` : Used to capture **query parameters** sent in the URL after the `?`.

- `getPost(@Param('id) id: any, @Query('limit') limit: any)` : retrieve specific params or queries.

## Request Body, Headers, Ip in NestJS Controllers

```ts
import { Controller, Post, Body, Headers, Ip } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Post()
  public createUser(@Body() body: any, @Headers() headers: any, @Ip() ip: any) {}
}
```

- `@Body()` : decorator used to capture the **body** (payload) of the incoming request.

- `@Headers()` : captures all the HTTP **headers** sent with the request. Headers contain metadata such as content type, authorization tokens, or custom data.

- `@Id()` : captures the client's IP address from the incoming request. Useful for logging or restricting access based on IP.
