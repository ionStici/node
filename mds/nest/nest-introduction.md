# NestJS Introduction

[**NestJS**](https://nestjs.com): A progressive Node.js framework for building efficient, reliable and scalable server-side applications.

## Table of Contents

- [Getting Started](#getting-started)
- [Introduction](#introduction)
- [`main.ts` Entry File](#maints-entry-file)
- [Basic Module Structure](#basic-module-structure)
- [The App Module](#the-app-module)
- [Controllers](#controllers)
- [Services](#services)
- [Creating a New Module](#creating-a-new-module)
  - [Connecting a Module to App Core Module](#connecting-a-module-to-app-core-module)
  - [Generating Modules via CLI](#generating-modules-via-cli)

## Getting Started

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create a new NestJS app
nest new nest-app --strict

# Start the dev environment
npm run start:dev
```

## Introduction

- A **module** in NestJS encapsulates functionality by grouping related files for a specific aspect of the app.

- The first file accessed by NestJS is `main.ts`, which is connected to the root module `app.module.ts`.

- `app.module.ts` is the main module that connects other modules, forming the core of the application.

## `main.ts` Entry File

`main.ts` is the entry file of the application.

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

- `NestFactory` : Core function that creates a Nest app instance.

- `AppModule` : The root module that connects all other modules.

- `bootstrap` : The main function that starts the application.

- `NestFactory.create(AppModule)` : Initializes the app using the root module.

- `app.listen(3000)` : Starts the server and listens on port 3000 for incoming requests.

## Basic Module Structure

- For example, the `auth` module would encapsulate functionality related to **authentication**.

- By convention, each module has its own dedicated directory.

- `auth/auth.module.ts` : The primary file that organizes related files of the `auth` module.

- `auth/auth.controller.ts` : Handles routing and API endpoints.

- `auth/providers/auth.service.ts` : Manages business logic and data handling. Groups other providers.

- `auth/providers/sign-up.provider.ts` : Provider responsible for the sign up feature.

- `auth/auth.entity.ts` : Defines the database structure (used with ORMs).

- `auth/auth.controller.spec.ts` : A test file for controller.

- Every module must be linked to `app.module.ts` to be identified by NestJS.

- NestJS starts bootstrapping from `main.ts`, proceeds to `app.module.ts`, and continues through other connected modules.

- Modules can be connected between each other using **dependency injection**.

## The App Module

`app.module.ts` is the core module imported into `main.ts` to bootstrap the entire application.

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
```

- `@Module({ ... })` : Decorator that marks a class as a NestJS module, used to organize and configure related module functionality into a cohesive block.

- `imports: [AuthModule]` : Define other modules that this module depends on.

- `controller: [AppController]` : Define the controllers for this module.

- `providers: [AppService]` : Lists services that provide business logic.

- `exports: [AppService]` : Makes `AppService` available for dependency injection to other modules.

- `export class AppModule {}` : Create and export the module. In this case, the `AppModule` is the root module of the app, providing an entry point for the rest of the app's functionality.

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

- `@Controller()` : Marks the class as a controller. In handles incoming requests, in this case at the root path (`/`).

- `@Get()` : Maps the `getHello()` method to handle GET http requests.

- `AppService` : Injected into the controller to provide methods for business logic.

## Services

`app.service.ts` contains the business logic, which can be shared across the application using **dependency injection**.

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

Add the `@Module` decorator to a class to mark it as a module.

```ts
// auth/auth.module.ts
import { Module } from "@nestjs/common";

@Module({})
export class AuthModule {}
```

This structure is the foundation of a module. To make it functional, you need to connect it to `app.module.ts`.

### Connecting a Module to App Core Module

Modules must be imported and registered in the app module for NestJS to recognize them.

```ts
// app.module.ts
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [AuthModule],
})
export class AppModule {}
```

### Generating Modules via CLI

```bash
nest generate module auth
```

This command creates a new `auth` module and adds it to the project automatically.
