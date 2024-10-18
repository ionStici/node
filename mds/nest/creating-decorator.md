# Creating and Applying Custom Decorators in NestJS

## The SetMetadata Decorator

The `SetMetadata` decorator provided by NestJS can be used to define custom metadata. This metadata can be used by other components such as guards, interceptors, or middlewares.

```ts
import { SetMetadata } from '@nestjs/common';

@SetMetadata('authType', 'None')
public createUser() {
  // ...
}
```

The example above sets the `authType` metadata key for the `createUser` method, indicating that it does not require authentication by assigning the `None` value.

## 1. Generate a Decorator

```bash
npx nest g d /auth/decorators/auth --flat --no-spec
```

## 2. Implement a Custom Decorator

```ts
// auth/decorators/auth.decorator.ts
import { SetMetadata } from "@nestjs/common";

export enum AuthType {
  Bearer,
  None,
}

export const AUTH_TYPE_KEY = "authType";

export const Auth = (...authTypes: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
```

- **`SetMetadata`** : A NestJS function that attaches metadata to the target (class or method).
- **`Auth` Decorator:** Accepts one or more `AuthType` values and sets them as metadata using the `AUTH_TYPE_KEY` key.
- **Purpose:** Marks routes with their required authentication types, enabling guards to enforce access control based on this metadata.

## 3. Applying the Decorator in a Controller

```ts
// users/users.controller.ts
import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { SetMetadata } from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/auth/enums/auth-type.enum";

@UseGuards(AuthenticationGuard)
@Controller("users")
export class UsersController {
  // @SetMetadata("authType", "None")

  @Post()
  @Auth(AuthType.None)
  public createUser() {}
}
```

- `@Auth(AuthType.None)` : Indicates that the createUser route does not require authentication.
- **Integrated with Guard:** The `AuthenticationGuard` will read this metadata and allow or deny access based on the authentication type specified.
