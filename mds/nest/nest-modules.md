# Modules in NestJS

## Table of Contents

- [Introduction](#introduction)
- [`main.ts` Entry Point](#maints-entry-point)
- [The App Module](#the-app-module)
  - [app.module.ts](#appmodulets)
  - [app.controller.ts](#appcontrollerts)
  - [app.service.ts](#appservicets)
- [Creating a New Module](#creating-a-new-module)
  - [Import and Use the Module](#import-and-use-the-module)
  - [Create a module using NestJS CLI](#create-a-module-using-nestjs-cli)

## Introduction

- A **module** encapsules functionality, grouping related files for one aspect of the app.

- The first file accessed by NestJS is `main.ts`, which is further connected to `app.module.ts`.

- `app.module.ts` is the main module of a NestJS app, and is used to connect to other modules.

- Everything related to the **Users** functionality would be inside a `users` module, and then connected to the **app** module.

- `users.module.ts` : primary file of a module.

- `users.controller.ts` : handles routing and API endpoints.

- `users.service.ts` : responsible for the business logic and data handling.

- `users.entity.ts` : defines database structure (used with ORMs like TypeORM).

- `users.controller.spec.ts` test file for controller.

- A module can have other files responsible for specific tasks.

- Every module must be linked to `app.module.ts`, to be identified by NestJS.

- NestJS starts bootstrapping from `main.ts`, continues to `app.module.ts`, and further to other modules connected to the **app** module.

- Modules can be connected to each other using **dependency injection**.

## `main.ts` Entry Point

The code below reflects the entry point of a NestJS application, where the app is bootstrapped and started.

```ts
// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

- `NestFactory` : is a class provided by NestJS to create and initialize an application instance. It provides methods for starting a NestJS application.

- `AppModule` : is the root module of the application. All other modules and services are connected through it.

- `async function bootstrap() { ... }` : this is the main function that starts the app

- `const app = await NestFactory.create(AppModule)` : This creates an instance of the NestJS application by using the root module.

- `await app.listen(3000)` : This starts the server and listens for incoming HTTP requests on port 3000.

- `bootstrap()` : calls the function to start the application.

## The App Module

**`app.module.ts`** is the only module that is imported into the `main.ts` file for bootstrapping the entire NestJS application.

`app.controller, ts` `app.controller.spec.ts` `app.service.ts` - All these files collectively constitute a module.

For convenience we could create an `app` directory and place all the files related to the **app** module into this directory.

### `app.module.ts`

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- `Module` - is a decorator that marks the class as a NestJS module. It is used to organize related functionality into a cohesive block.

- `AppController` - handles routing and HTTP requests.

- `AppService` - contains the business logic and functionality of the app.

- `@Module({ ... })` - this is the key decorator that configures the module.

- `imports: []` - Here, you would import other modules that this module depends on.

- `controllers: [AppController]` - Specifies the controllers for this module.

- `providers: [AppService]` - Lists the services that provide business logic or functionality.

- `export class AppModule {}` - This defines the `AppModule` class, which is the root module of the application, and is the entry point to the rest of the app's functionality.

### `app.controller.ts`

```ts
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### `app.service.ts`

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
}
```

## Creating a New Module

What makes a class a module is adding the `Module` NestJS decorator. This `Module` decorator takes in an object where you define different import providers as well as exports.

```ts
// users/users.module.ts
import { Module } from "@nestjs/common";

@Module({})
export class UsersModule {}
```

A module in itself is just this kind of structure where you add the `Module` decorator to the module class. In order for NestJS to identify this newly created module we need to connect it to the main **app** module.

### Import and Use the Module

Create a module using NestJS CLI

```ts
// app.module.ts
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

### Create a module using NestJS CLI

```bash
nest generate module users
```

This command will generate a new `users` module just like above.
