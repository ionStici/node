# Implementing and Using Guards

## Table of Contents

- [Implementing the AccessTokenGuard](#implementing-the-accesstokenguard)
  - [Overview of the Guard](#overview-of-the-guard)
  - [Key Concepts](#key-concepts)
  - [Generate the Guard using the CLI](#generate-the-guard-using-the-cli)
  - [AccessToken Guard](#accesstoken-guard)
- [Apply the Guard to a Specific Route in the Users Module](#apply-the-guard-to-a-specific-route-in-the-users-module)
  - [Configure the Users Module to Use JWT](#configure-the-users-module-to-use-jwt)
  - [Apply the Access Token Guard to a Route](#apply-the-access-token-guard-to-a-route)
  - [Test the Guard](#test-the-guard)
- [Applying AccessTokenGuard Globally](#applying-accesstokenguard-globally)
  - [Key Concepts](#key-concepts)
  - [Apply the Access Token Guard Globally in the App Module](#apply-the-access-token-guard-globally-in-the-app-module)
- [Apply Guard to a Specific Controller](#apply-guard-to-a-specific-controller)

## Implementing the AccessTokenGuard

### Overview of the Guard

The **Access Token Guard** should:

1. **Extract the JWT token** from the request header.
2. **Validate** the token using the `JwtService`.
3. If valid, attach the token's **payload** (user details) to the request object.
4. **Authorize** or **reject** the request based on the token's validity.

### Key Concepts

- **Guards** are used to allows or deny access to specific routes.
- The `@CanActivate` method is where the logic for token extraction and validation occurs.
- We use `JwtService` to handle the JWT verification.
- Guards can be applied at the **controller** or **route** level using the `@UseGuards` decorator.

### Generate the Guard using the CLI

```bash
npx nest g guard /auth/guards/access-token --no-spec
```

### AccessToken Guard

```ts
// auth/guards/access-token/access-token.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "src/auth/config/jwt.config";
import { REQUEST_USER_KEY } from "src/auth/constants/auth.constants";

export const REQUEST_USER_KEY = "user";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  // The main method to check if a request is authorized
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Extract the request from the execution context
    const request = context.switchToHttp().getRequest<Request>();

    // Extract the token from the header
    const token = this.extractRequestFromHeader(request);

    // If the token is missing, throw UnauthorizedException
    if (!token) throw new UnauthorizedException();

    try {
      // Validate token and extract the payload
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);

      // Attach payload to the request object
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  // Helper method to extract token from the Authorization header
  private extractRequestFromHeader(request: Request): string | undefined {
    // Extract the token from the `Authorization` header in the form `Bearer <token>`.
    const [_, token] = request.headers.authorization?.split(" ") ?? [];
    return token;
  }
}
```

**1. Inject Dependencies:**

- `JwtService` : Used to validate the JWT token.
- `ConfigType<typeof jwtConfig>` : Injected configuration that holds the JWT secret and other settings.

**2. canActivate Method:**

- **Extract Request:** Get the request from the `ExecutionContext`.
- **Extract Token:** Extract the JWT token from the `Authorization` header.
- **Validate Token:** Use `JwtService.verifyAsync()` to validate the token. If valid, extract the **payload** (user information).
- **Attach Payload:** Add the payload to the request object (`request[REQUEST_USER_KEY]`).
- **Handle Invalid Tokens:** If the token is missing or invalid, throw an `UnauthorizedException`.

## Apply the Guard to a Specific Route in the Users Module

### Configure the Users Module to Use JWT

```ts
// users/users.module.ts
import { AuthModule } from "src/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "src/auth/config/jwt.config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class UsersModule {}
```

### Apply the Access Token Guard to a Route

```ts
// users/users.controller.ts
import { UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/guards/access-token/access-token.guard";

@Controller("users")
export class UsersController {
  @UseGuards(AccessTokenGuard) // Apply the Access Token Guard to this route
  @Get("get-user")
  public getUser() {
    return { message: "This is protected user data" };
  }
}
```

### Test the Guard

```
GET http://localhost:3000/users/get-user
Authorization: Bearer <your_valid_jwt_token>
```

- **Without a Token:** When making a request to the `/users/get-user` route without a JWT token, you should receive a `401 Unauthorized` error.
- **With an Invalid Token:** If an invalid or tampered token is used, the response should still be a `401 Unauthorized` error.
- **With a Valid Token:** After successfully signing in and obtaining a valid token, the request should succeed.

## Applying AccessTokenGuard Globally

### Key Concepts

- **Global Guards:** By applying a guard globally, all routes in the application are protected by default. This ensures that the application is secure by requiring authentication for all routes unless explicitly made public.
- `APP_GUARD` : A constant provided by NestJS that allows you to declare a global guard at the application level.

### Apply the Access Token Guard Globally in the App Module

```ts
// app.module.ts
import jwtConfig from "./auth/config/jwt.config";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "./auth/guards/access-token/access-token.guard";

@Module({
  imports: [ConfigModule.forFeature(jwtConfig), JwtModule.registerAsync(jwtConfig.asProvider())],
  providers: [
    {
      provide: APP_GUARD, // Provides a global guard
      useClass: AccessTokenGuard, // Uses the AccessTokenGuard globally
    },
  ],
})
export class AppModule {}
```

By adding the `APP_GUARD` and associating it with `AccessTokenGuard`, we make sure that all routes require authentication unless explicitly configured otherwise.

With the guard applied globally, every route in the application is now protected.

## Apply Guard to a Specific Controller

```ts
// users/users.controller.ts

@UseGuards(AccessTokenGuard) // Apply the guard to this controller
@Controller("users")
export class UsersController {}
```

All routes from this controller a protected using the `AccessTokenGuard`.
