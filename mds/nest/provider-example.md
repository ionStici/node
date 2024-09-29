# Injectable Provider Example

## Declare

```ts
// users/providers/users.service.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  public getUserById(id: number) {
    const users = [{ id: 10, name: "John" }];
    return users.find(({ userId }) => userId === id);
  }
}
```

- `@Injectable()` : Decorator that makes the `UsersService` class a **provider**. Providers are the classes used for business logic and are available for injection into other components.

## Connect

```ts
// users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./providers/users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

- `providers: [UsersService]` : Adds the `UsersService` to the module, making it available for all components within the module. This connection allows other components of `UsersModule` to user `UsersService`.

## Inject

```ts
// users/users.controller.ts
@Controller("users")
export class UsersController {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService
  ) {}

  @Get("/:id")
  getUser(@Param("id", ParseIntPipe) id: number) {
    // Using The Provider
    return this.usersService.getUserById(id);
  }
}
```

- **Constructor Injection:** `private readonly usersService: UsersService` in the constructor signals NestJS to inject an instance of `UsersService` whenever the `UsersController` is instantiated.
- **Automatic Instantiation:** NestJS handles the instantiation of `UsersService`, and there is no need to manually create an instance. This is handled by the dependency injection system.
- A controller is responsible of handling the requests, any other responsibilities like business logic should be delegated to providers. In this case, the controller is calling the `getUserById` method provided by the `usersService` provider.

## Summary

- **Declare:** Use `@Injectable()` to declare a class as a provider.
- **Connect:** Register the provider in the module using the `providers` array.
- **Inject:** Inject the service into another class (like a controller) through the constructor, allowing NestJS to provide an instance automatically.

## Generate Service using Nest CLI

```bash
nest generate service posts/providers/posts --flat
```

## Terminology

### Injectable Class as a Provider and Service

- An **injectable class** in NestJS is called a **provider** because it provides functionalities or dependencies that other parts of the application can use. It's a class that can be injected where needed, making it available as a shared resource.
- The term **service** is used because these classes often encapsulate business logic—handling tasks like data manipulation, database operations, or other reusable actions. Therefore, the file name typically includes "service" to indicate its purpose, while the class is labeled as a **provider** because it provides these services to other components.

### Business Logic

- **Business logic** refers to the rules, processes, and operations that define how an application solves a particular problem or meets business requirements. It includes calculations, data transformations, and decision-making processes that are specific to the application's functionality, such as processing orders, managing users, or verifying data. Business logic is distinct from infrastructure-level code like routing or user interface components—it’s the core functionality that defines the purpose of the software.
