# Modules in NestJS

## Table of Contents

- [Introduction](#introduction)
  - [Key Files in a Module](#key-files-in-a-module)
- [`main.ts` Entry Point](#maints-entry-point)
- [The App Module](#the-app-module)
- [Controllers](#controllers)
- [Services](#services)
- [Creating a New Module](#creating-a-new-module)
  - [Connecting the New Module to App Module](#connecting-the-new-module-to-app-module)
  - [Generating Modules via CLI](#generating-modules-via-cli)

## Introduction

- A **module** in NestJS encapsules functionality by grouping related files for a specific aspect of the app.

- The first file accessed by NestJS is `main.ts`, which is connected to the root module, `app.module.ts`.

- `app.module.ts` is the main module that connects other modules, forming the core of the application.

- For example, the **Users** functionality would be encapsulated in a `users.module.ts`, and then linked to the **app** module.

### Key Files in a Module

- `users.module.ts` : The primary file that organizes related files for users.

- `users.controller.ts` : Handles routing and API endpoints for users.

- `users.service.ts` : Manages business logic and data handling.

- `users.entity.ts` : Defines the database structure (used with ORMs like TypeORM).

- `users.controller.spec.ts` A test file for controller.

- A module can have other files based on the app’s needs.

- Every module must be linked to `app.module.ts`, to be identified by NestJS.

- NestJS starts bootstrapping from `main.ts`, proceeds to `app.module.ts`, and continues through other connected modules.

- Modules can be connected between each other using **dependency injection**.

## `main.ts` Entry Point

This file is the **entry point** of a NestJS application, where the app is initialized and started:

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

- `NestFactory` : A NestJS class used to create and initialize an application instance.
- `AppModule` : The root module, connecting all other modules and services.
- `bootstrap()` : The main function that starts the app
- `NestFactory.create(AppModule)` : Initializes the app using the root module.
- `app.listen(3000)` : Starts the server and listens on port 3000 for incoming requests.

## The App Module

**`app.module.ts`** is the core module imported into `main.ts` to bootstrap the entire application. It connects controllers and services.

```ts
// app.module.ts
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

- `Module` : Decorator that marks a class as a NextJS module, used to organize related functionality into a cohesive block.

- `@Module({ ... })` : Configures the module.

- `imports: []` - Define other modules that this module depends on.

- `controllers: [AppController]` - Specifies the controllers for this module.

  - `AppController` handles incoming HTTP requests (routing).

- `providers: [AppService]` - Lists services that provide business logic or other features.

  - `AppService` contains business logic and core functionality.

- `export class AppModule {}` - Defines `AppModule`, the root module of the application, providing an entry point for the rest of the app's functionality.

## Controllers

`app.controller.ts` defines the logic for handling HTTP requests. Controllers direct incoming requests to appropriate services.

```ts
// app.controller.ts
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

- `@Controller()` : Marks the class as a controller. It handles incoming requests, in this case at the root path (`/`).

- `@Get()` : Maps the `getHello()` method to handle HTTP GET requests.

- `AppService` : Injected into the controller to provide business logic.

- **Dependency Injection**: The `AppService` is injected via the constructor, allowing the controller to use its methods.

## Services

`app.service.ts` contains the business logic, which can be shared across the application via **dependency injection**.

```ts
// app.service.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
}
```

- `@Injectable` : This decorator marks the class as a provider (service) that can be injected into other classes, such as controllers.

- `AppService` : Contains the app business logic.

## Creating a New Module

To create a new module, you add the `@Module` decorator to a class, which allows NestJS to recognize and use it.

```ts
// users/users.module.ts
import { Module } from "@nestjs/common";

@Module({})
export class UsersModule {}
```

This structure is the foundation of a module. To make it functional, you need to connect it to `app.module.ts`.

### Connecting the New Module to App Module

After creating a module, it must be imported and registered in the app module for NestJS to recognize it:

```ts
// app.module.ts
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

### Generating Modules via CLI

```bash
nest generate module users
```

This command creates a new `users` module and adds it to the project automatically.
