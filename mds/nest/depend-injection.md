# Dependency Injection (DI)

**Dependency Injection (DI)** simplifies how components (like classes) interact by ensuring that required dependencies (classes) are provided externally, rather than created internally. This reduces tight coupling and improves code maintainability.

## Table of Contents

- [What is Dependency Injection](#what-is-dependency-injection)
  - [DI Review](#di-review)
- [Dependency Injection in NestJS](#dependency-injection-in-nestjs)
  - [Overview](#overview)
  - [NestJS DI System](#nestjs-dependency-injection)
  - [Advantages of DI](#advantages-of-di)
- [NestJS Dependency Injection](#nestjs-dependency-injection)
  - [Declare an Injectable Class (Provider)](#declare-an-injectable-class-provider)
  - [Connect Providers in Modules](#connect-providers-in-modules)
  - [Injecting the Provider into Other Classes](#injecting-the-provider-into-other-classes)
- [Module Encapsulation and Sharing](#module-encapsulation-and-sharing)

## What is Dependency Injection

**Dependency:** A class depends on another class.

**Without Dependency Injection:** Each class instantiates its own dependencies every time using `new`, which leads to tight coupling and code duplication as multiple instances of the same dependency are created unnecessarily.

**Inversion of Control:** _Dependency Injection_ inverts the responsibility of dependency creation. Instead of each class managing its own dependencies, the framework (NestJS) manages and injects dependencies where needed.

### DI Review

- Dependency Injection reduces tight coupling between classes by letting the framework manage the creation and injection of dependencies.

- NestJS automates DI, allowing developers to focus on business logic while ensuring efficient object management across the application.

- By using DI, NestJS ensures that resources are not duplicated, dependencies are shared, and the code remains modular and maintainable.

## Dependency Injection in NestJS

NestJS uses **Dependency Injection (DI)** extensively to manage how components (like services and classes) are created and supplied to other parts of the application.

### Overview

- **Dependencies:** Classes that rely on other classes to function. For example, a `Post` class may rely on a `User` class for its functionality.

- **Inversion of Control (IoC):** The responsibility of creating dependencies (like `User`) is shifted from the dependent class (e.g. `Post`) to an external system (NestJS). This external system injects the dependency where needed.

### NestJS DI System

- NestJS manages a **dependency graph** and knows the correct order in which to instantiate classes. For instance, the `User` class will be instantiated before the `Post` class if they rely on it.

- By default, instances of classes are treated as **singletons** in NestJS. This means that only one instance of a class is created and shared across the application.

### Advantages of DI

- **Decoupling:** Components are loosely coupled, meaning that the `Post` class no longer directly depends on the `User` class. This decoupling allows more flexibility and modularity.

- **Testing:** With DI, it's easier to **mock** dependencies during testing. For example, you can mock the `User` class when testing the `Post` class, without needing to instantiate the real `User` class.

- **Reusability:** Since a single instance of a class (like `User`) is shared, it promotes code reuse across multiple parts of the application.

## NestJS Dependency Injection

### Declare an Injectable Class (Provider)

Classes like services need to be marked with the `@Injectable()` decorator to be injectable and available for DI.

```ts
// app.service.ts
@Injectable
export class AppService {
  getHello(): string {
    return "Hello From NestJS!";
  }
}
```

### Connect Providers in Modules

The class (e.g. `AppService`) is then added to the `providers` array of a module (e.g. `AppModule`). This step makes it available for other parts of the module to inject it.

```ts
// app.module.ts
@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Injecting the Provider into Other Classes

The class is injected into other parts of the application through the constructor:

```ts
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

## Module Encapsulation and Sharing

In NestJS, modules encapsulate all the services, controllers, and other providers. By default, these components are private to the module unless explicitly shared.

- **Providing:** The module decides which services to provide within itself.
- **Exporting:** To share services with other modules, the module must export them.

```ts
@Module({
  providers: [UserService],
  exports: [UserService],
})
```
