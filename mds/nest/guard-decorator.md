# Implementing the Authentication Guard in NestJS

## Custom Decorator

Custom Decorator for determining if a route needs authorization or is public.

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

## AuthenticationGuard

```ts
// auth/guards/authentication/authentication.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AccessTokenGuard } from "../access-token/access-token.guard";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { AUTH_TYPE_KEY } from "src/auth/constants/auth.constants";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  // Default authentication type
  private static readonly defaultAuthType = AuthType.Bearer;

  // Map of authentication types to their corresponding guards
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve authTypes from metadata, default to Bearer if none
    const authTypes = this.reflector.getAllAndOverride<authType[]>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    // Resolve the guards for each authType
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // Default error to throw if unauthorized
    let error = new UnauthorizedException();

    // Loop through the guards and execute their canActivate methods
    for (const instance of guards) {
      const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }

    // If none of the guards allow the request, throw unauthorized error
    throw error;
  }
}
```

- `defaultAuthType` is set to `AuthType.Bearer`, meaning routes require a bearer token by default.

- `Reflector` : A utility class provided by NestJS to access custom metadata set by decorators.

- `AccessTokenGuard` : The guard responsible for handling JWT authentication.

- `authTypeGuardMap` maps each `AuthType` to its corresponding guard(s). For `AuthType.Bearer`, we use the `AccessTokenGuard`, for `AuthType.None` we create an object with an `canActivate` method that always returns `true`, effectively allowing all requests (public routes).

## Register the `AuthenticationGuard` Globally

```ts
// app.module.ts
import { APP_GUARD } from "@nestjs/core";
import { AuthenticationGuard } from "./auth/guards/authentication/authentication.guard";
import { AccessTokenGuard } from "./auth/guards/access-token/access-token.guard";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
```

- Since `AuthenticationGuard` depends on `AccessTokenGuard`, ensure it's provided in the module.

## Controller Example

```ts
@Controller("users")
export class UsersController {
  @Post()
  @Auth(AuthType.None) // this route is public
  public createUser() {}

  // @Auth(AuthType.Bearer) // Optional, will use default AuthType.Bearer
  @Post("protected")
  public protectedRoute() {}
}
```
