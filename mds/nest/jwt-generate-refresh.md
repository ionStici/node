# Generate / Refresh JWT Tokens

## Introduction

- **Access Tokens:** Short-lived (e.g. 3600 seconds), used for authentication. Shorter lifespan increases security because they are stored in the browser and can be exploited.
- **Refresh Tokens:** Longer lifespan (e.g. 86400 seconds), used to generate new access tokens. Cannot replace access tokens but can regenerate them.
- **Process:** After a user signs in, both access and refresh tokens are generated. The frontend monitors token expiry and uses the refresh token to get new access tokens without user intervention.

## Sign In Provider

```ts
// src/auth/providers/sign-in.provider.ts
import { GenerateTokensProvider } from "./generate-tokens.provider";

@Injectable()
export class SignInProvider {
  constructor(private readonly generateTokensProvider: GenerateTokensProvider) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    // ... sign in logic

    return await this.generateTokensProvider.generateTokens(user);
  }
}
```

- After a successful sign in process, the `generateTokens` method returns both the access and refresh tokens.
- The frontend receives and stores these tokens, and uses them for subsequent authenticated requests.

## Generate Tokens Provider

```ts
// src/auth/providers/generate-tokens.provider.ts
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.entity";
import jwtConfig from "../config/jwt.config";

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  public async signToken(userId: number, expiresIn: number, payload?: any) {
    return await this.jwtService.signAsync(
      {
        sub: userId, // Subject of the token (usually user ID)
        ...payload, // Additional information in the payload (email)
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn,
      }
    );
  }

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // Generate Access Token with Email
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, { email: user.email }),
      // Generate Refresh Token without Email
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return { accessToken, refreshToken };
  }
}
```

- The `signToken` method is used to sign both access and refresh tokens. The `jwtService.signAsync` method is used to generate tokens, it receives 2 arguments, the (1) payload and (2) options.

- The `generateTokens` method generates both access and refresh tokens together, using the `signToken` method internally. It takes a `User` entity as the parameter to extract user ID and email for the tokens.

- **Token Payload:** Access tokens include both user ID and email, while refresh tokens only contain the user ID. This distinction to crucial to ensure they aren't interchangeable.

With this implementation, the provider can generate both tokens efficiently for user authentication.

## Refresh Tokens Provider

```ts
// src/auth/providers/refresh-tokens.provider.ts
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
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
    // Verify the refresh token using jwtService
    try {
      const { sub } = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      // Fetch the user from the database
      const user = await this.usersService.findOneById(sub);

      // Generate the tokens
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
```

- **Refresh Tokens Flow:** The `refreshTokens` method allows the user to obtain a new access token using the refresh token they received upon sign-in. This involves a new endpoint (`/auth/refresh-tokens`).

- **Steps in the refreshTokens method:**

  - **Verify Refresh Token:** The refresh token is verified using `jwtService.verifyAsync`.
  - **Fetch User:** Based on the user ID from the verified token, the user is retrieved from the database using `usersService.findOneById`.
  - **Generate New Tokens:** If verification is successful, both new access and refresh tokens are generated using `generateTokensProvider`.
  - **Error Handling:** If any issues arise, an `UnauthorizedException` is thrown.

This setup ensures the user can continuously receive fresh access tokens without repeatedly signing in, enhancing user experience and maintaining security.

### Controller

```ts
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("refresh-tokens")
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
```

- **Controller Endpoint:** A new API endpoint `/auth/refresh-tokens` is created in `AuthController` to handle the refresh token requests.

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

- **Service Layer:** The `AuthService` integrates the `refreshTokensProvider`, and the controller method `refreshTokens` calls this service to generate new tokens based on the received refresh token DTO.
