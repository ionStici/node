# Introduction to Decorators in NestJS

## What are Decorators

Decorators are special functions in TypeScript that let you add extra features or information to classes, methods, or parameters. In NestJS, decorators are used to tell the framework how to handle your code.

They are annotations that start with an `@` symbol and are placed right above the code they affect.

### Types of Decorators

- **Class Decorators:** Applies to classes. `@Controller()` marks a class as a controller that can handle incoming requests.
- **Method Decorators:** Applied to methods inside classes. `@Get()` marks a method to handle HTTP GET requests.
- **Parameter Decorators:** Applied to parameters within methods. `@Body()` extracts data from the body of an HTTP request.

### Simple Example

```ts
import { Controller, Post, Body } from "@nestjs/common";

@Controller("users") // <- Class decorator
export class UsersController {
  @Post() // <- Method decorator
  create(
    @Body() userData // <- Parameter decorator
  ) {}
}
```

- `@Controller('users')` tells NestJS that this class handles routes starting with `/users`.
- `@Post()` specify the HTTP methods for the routes.
- `@Body()` tells NestJS to pass the request body to the `userData` parameter.

## Using `@SetMetadata`

NestJS provides the `@SetMetadata` decorators for adding custom metadata. This metadata then can be used by other components such as guards, interceptors, or middlewares.

Suppose you have routes that don't require authentication. You can set a custom metadata key `isPublic` to `true` using `@SetMetadata`:

```ts
import { SetMetadata } from '@nestjs/common';

@SetMetadata('isPublic', true)
public getItem () {}
```

Now, you can check this `isPublic` metadata in a guard to skip authentication for this route.

## Creating Custom Decorators

Create a `@Public` decorators to mark routes that don't require authentication:

```bash
npx nest g d /decorators/public.decorator --flat --no-spec
```

```ts
// decorators/public.decorators.ts
import { SetMetadata } from "@nestjs/common";

const IS_PUBLIC_KEY = "isPublic";

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

- `IS_PUBLIC_KEY` is the key for the metadata.
- `Public` is the custom decorator function.

### Use the Custom Decorator

Mark routes that don't require authentication with the `@Public` decorator:

```ts
import { Public } from "decorators/public.decorator";

@Public()
@Controller()
export class ArticlesController {
  // this routes is public
}
```

## Accessing Metadata with the `Reflector` Class

NestJS provides a `Reflector` class that allows you to access this metadata in other parts of the application, such as **guards, interceptors, pipes,** or **middlewares**. Using this class, you can extract metadata set by decorators and use it in decision-making processes (e.g. whether to allows access to a route).

### Checking for Public Routes in a Guard

The guard will check the request, if the route is marked with `@Public`, it will allow it, otherwise it will enforce authentication.

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get("isPublic", context.getHandler());

    if (isPublic) return true; // Allow access to public routes

    // Add your authentication logic here
    return false; // Block access if not authenticated
  }
}
```

- `reflector.get()` retrieves the metadata.
- `context.getHandler()` gets the method being called.

## Summary

- Decorators are functions that add extra features to your code in NestJS.
- They help NestJS understand how to handle different parts of your application.
- You can **set custom metadata** using `@SetMetadata`.
- **Custom decorators** like `@Public()` make your code cleaner and easier to read.
- The `Reflector` **class** lets you access metadata in guards and other places, so you can make decisions based on it.

By using decorators, you can write NestJS applications that are organized and easy to maintain.
