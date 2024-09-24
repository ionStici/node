# Controllers

A **controller** in an application handles all routing logic. Its main function is to receive incoming requests and determine which method to trigger based on the request type (e.g., GET, POST, DELETE). Each request type has its own method within the controller to process it. Thus, a controller processes various request methods through specific functions.

## Table of Contents

- [Creating Controllers](#creating-controllers)
  - [Registering the Controller](#registering-the-controller)
- [Creating a Controller use NestJS CLI](#creating-a-controller-use-nestjs-cli)

## Creating Controllers

```ts
// users/users.controller.ts
import { Controller } from "@nestjs/common";

// http://localhost:3000/users
@Controller("users")
export class UsersController {}
```

### Creating a Controller use NestJS CLI

```bash
nest generate controller users --no-spec
```

## Registering the Controller

Creating a Controller use NestJS CLI

```ts
// users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
```
