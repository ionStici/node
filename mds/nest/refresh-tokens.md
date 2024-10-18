# Refresh Tokens

## Introduction

- **Access Tokens:** Short-lived (e.g., 3600 seconds), used for authentication. Shorter lifespan increases security because they are stored in the browser and can be exploited.
- **Refresh Tokens:** Longer lifespan (e.g., 86,400 seconds or one day), used to generate new access tokens. Cannot replace access tokens but can regenerate them.
- **Difference:** Refresh tokens have minimal payload (e.g., user ID), while access tokens have a more complex payload. They should not be used interchangeably.
- **Process:** After a user signs in, both access and refresh tokens are generated. The front-end monitors token expiry and uses the refresh token to get new access and refresh tokens without user intervention.
- **Implementation:** Next steps involve adding an endpoint to generate both tokens using the refresh token, allowing continuous token renewal until the refresh token expires.

## Configuration

```makefile
# .env.development
JWT_REFRESH_TOKEN_TTL=86400
```

```ts
// auth/dtos/refresh-token.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
```

```ts
// auth/config/jwt.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => {
  return {
    // ...
    refreshTokenTTL: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? "864000", 10),
  };
});
```

## Generate Tokens Provider

```ts
// /src/auth/providers/generate-tokens.provider.ts
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.entity";
import jwtConfig from "../config/jwt.config";
import { ActiveUserData } from "../interfaces/active-user-data.interface";

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      }
    );
  }

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // Generate The Access Token
      this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTTL, {
        email: user.email,
      }),
      // Generate the refreshToken
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTTL),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
```

- **Sign Token Method:** The `signToken` method is used to sign both access and refresh tokens, using a common logic encapsulated in a provider to avoid code duplication.

- **Token Payload:** Access tokens include both user ID and email, while refresh tokens only contain the user ID. This distinction is crucial to ensure they aren't interchangeable.

- **Generic Method:** The `signToken` method is generic, accepting a user ID, expiration time (`expiresIn`), and optional payload (used for access tokens but not for refresh tokens).

- **JWT Service and Configuration:** JWT dependencies like service and configuration are injected into the provider for token generation.

- **Generate Tokens Method:** The `generateTokens` method generates both access and refresh tokens together, using the `signToken` method internally.

- **Parameters:** It takes a `User` entity as the parameter to extract user ID and email for the tokens.

- **Access Token:** Requires the user ID, expiration time (from config), and email as payload.

- **Refresh Token:** Only requires the user ID and expiration time (from config), with no payload.

- **Promise.all:** Used to handle asynchronous operations, allowing both tokens to be generated simultaneously.

- **Return Object:** The method returns both tokens as an object with access token and refresh token properties.

With this implementation, the provider can generate both tokens efficiently for user authentication.

```ts
// /src/auth/providers/sign-in.provider.ts
import { GenerateTokensProvider } from "./generate-tokens.provider";

@Injectable()
export class SignInProvider {
  constructor(private readonly generateTokensProvider: GenerateTokensProvider) {}
  public async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    // ... auth logic

    return await this.generateTokensProvider.generateTokens(user);
  }
}
```

## Refresh Tokens Provider

```ts
// src/auth/providers/refresh-tokens.provider.ts
import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/providers/users.service";
import jwtConfig from "../config/jwt.config";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { ActiveUserData } from "../interfaces/active-user-data.interface";
import { GenerateTokensProvider } from "./generate-tokens.provider";

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly generateTokensProvider: GenerateTokensProvider
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token using jwtService
      const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, "sub">>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        }
      );

      // fetch user from the database
      const user = await this.usersService.findOneById(sub);

      // Generate the tokens
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
```

**Refresh Tokens Flow:** The `refreshTokens` method allows the user to obtain a new access token using the refresh token they received upon sign-in. This involves a new endpoint (`/auth/refresh-tokens`).

**Steps in the refreshTokens method:**

- **Verify Refresh Token:** The refresh token is verified using jwtService.verifyAsync.
- **Fetch User:** Based on the user ID from the verified token, the user is retrieved from the database using usersService.findOneById.
- **Generate New Tokens:** If verification is successful, both new access and refresh tokens are generated using generateTokensProvider.
- **Error Handling:** If any issues arise, an UnauthorizedException is thrown.
  Type Safety: The method is made type-safe by picking the sub property from the ActiveUserData interface.

Controller Endpoint: A new API endpoint /auth/refresh-tokens is created in AuthController to handle the refresh token requests.
Service Layer: The AuthService integrates the refreshTokensProvider, and the controller method refreshTokens calls this service to generate new tokens based on the received refresh token DTO.
Testing: The process is demonstrated by first obtaining a refresh token upon sign-in, then using the /auth/refresh-tokens endpoint to request a fresh pair of tokens. Both tokens are returned successfully if the request is valid.
This setup ensures the user can continuously receive fresh access tokens without repeatedly signing in, enhancing user experience and maintaining security.

### Controller

```ts
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("refresh-tokens")
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
```

### AuthService

```ts
@Injectable()
export class AuthService {
  constructor(private readonly refreshTokensProvider: RefreshTokensProvider) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
```
