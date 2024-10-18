# Introduction to Decorators in NestJS

## 1. What are Decorators

Decorators in NestJS are **TypeScript decorators** that add **metadata** to classes, methods, or method parameters. This metadata provides information that NestJS can use to react or behave in a specific way.

- `@Controller` is a **class decorator** that defines a class as a controller.
- `@Post` is a **method decorator** that marks a method as a route handler for `POST` requests.
- `@Body` is a **parameter decorator** that extracts the body from the incoming request.

## 2. Purpose of Metadata

The main purpose of decorators is to **set metadata**. Metadata provides additional information about a class, method, or parameter that can be sued within the application's **execution context**. This allows NestJS to identify different routes, methods, and behaviors in your application.

For example, when you use:

```ts
@Post("create-many-users")
```

The `"create-many-users"` string becomes metadata, which allows NestJS to map HTTP requests to the correct route.

## 3. Using `@SetMetadata`

NestJS provides the `@SetMetadata` decorator, which allows you to set custom metadata. This can be useful when you need to define additional data or flags that other parts of your application (such as guards or interceptors) can use.

For instance, you can mark routes as public using:

```ts
@SetMetadata('isPublic', true)
```

This metadata can be checked in a guard to allow unauthenticated access to public routes.

## 4. The `Reflector` Class

NestJS provides a **Reflector** class that allows you to access this metadata in other parts of the application, such as **guards, interceptors, pipes,** or **middlewares**. Using this class, you can extract metadata set by decorators and use it in decision-making processes (e.g. whether to allows access to a route).

## 5. Creating Custom Decorators

In addition to using the built-in decorators, NestJS allows you to create **custom decorators**. These can be used to simplify common tasks and improve code readability. For example, instead of manually using `@SetMetadata` for each public route, you can create a custom `@Public` decorators to mark routes that don't required authentication.

### Example: Making Routes as Public

Create a custom `@Public` decorator to mark routes that don't require authentication.

```ts
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

## 6. Using Metadata in a Guard

Once we've marked a route as public using `@Public`, we can access this metadata inside a guard. We can use the **Reflector** class to retrieve the metadata and decide whether or not ot allow the request to proceed.

```ts
import { CanActivate, ExecutionContext, Injectable, Reflector } from "@nestjs/common";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): Boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // logic to check jwt token if the route is not public

    return false;
  }
}
```
