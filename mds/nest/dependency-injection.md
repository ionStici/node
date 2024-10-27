# Dependency Injection (DI)

## Table of Contents

- [Definition](#definition)
- [Types Of Dependencies in NestJS](#types-of-dependencies-in-nestjs)
- [NestJS Dependency Injection](#nestjs-dependency-injection)
  - [Injectable Providers](#injectable-providers)
  - [Connect Providers to the Module](#connect-providers-to-the-module)
  - [Inject the Service into the Controller](#inject-the-service-into-the-controller)
- [Generate a Service using Nest CLI](#generate-a-service-using-nest-cli)

## Definition

- **Dependency:** A class depends on another class.

- **Dependency Injection (DI)** in NestJS is a technique used to implement **Inversion of Control (IoC)** for resolving dependencies.

- **Inversion of Control (IoC):** The responsibility of creating and managing dependencies is delegated to the system (NestJS).

- NestJS manages a **dependency graph** and knows the correct order in which to instantiate classes.

- Instances of classes are treated as **singletons**, this means that only one instance of a class is created and shares across the application.

## Types Of Dependencies in NestJS

1. **Intra-modular Dependency Injection:** dependency within a single module, where one component or service depends on another within the same module.

2. **Inter-Module Dependency Injection:** dependencies between different modules.

3. **Circular Dependencies:** two modules depend on each other.

## NestJS Dependency Injection

### Injectable Providers

The `@Injectable()` decorator makes the class available for dependency injection.

```ts
// users/providers/sign-in.provider.ts
import { Injectable } from "@nestjs/common";

export class SignInProvider {
  public signIn() {
    return true;
  }
}
```

Each injectable class must be connected to the module it belongs.

```ts
// users/providers/users.service.ts
import { Injectable } from "@nestjs/common";
import { SignInProvider } from "./sign-in.provider";

@Injectable()
export class UsersService {
  // Inject a provider to make its methods available for use
  constructor(private readonly signInProvider: SignInProvider) {}

  public signIn() {
    return this.signInProvider.signIn();
  }
}
```

The `SignInProvider` provider is injected through the constructor.

### Connect Providers to the Module

```ts
// users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersService } from "./providers/users.service";
import { SignInProvider } from "./providers/sign-in.provider";

@Module({
  providers: [UsersService, SignInProvider],
  exports: [UsersService],
})
export class UsersModule {}
```

This connection makes the providers available for other parts of the module to inject and use its functionality.

- `providers` : Connect the provider to share within this particular module.
- `exports` : Make a provider available for sharing with other modules via DI.

### Inject the Service into the Controller

```ts
// users/users.controller.ts
import { UsersService } from "./providers/users.service.ts";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  signIn() {
    return this.usersService.signIn();
  }
}
```

**Constructor Injection:** `private readonly usersService: UsersService` in the constructor signals NestJS to inject an instance of `UsersService` whenever `UsersController` is instantiated.

## Generate a Service using Nest CLI

```bash
nest generate service posts/providers/posts --flat
```
