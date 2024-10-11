# Configuring JWT in NestJS

## Table of Contents

- [Install NestJS JWT Package](#install-nestjs-jwt-package)
- [Set Up Environment Variables](#set-up-environment-variables)
- [JWT Configuration File](#jwt-configuration-file)
- [Register JWT Module in the Auth Module](#register-jwt-module-in-the-auth-module)

## Install NestJS JWT Package

```ts
npm i @nestjs/jwt
```

## Set Up Environment Variables

These variables will be used for token generation and validation.

```
JWT_SECRET=86df14a9a5850a6147d5bdb6e31eb7c549a98b
JWT_TOKEN_AUDIENCE=localhost:3000
JWT_TOKEN_ISSUER=localhost:3000
JWT_ACCESS_TOKEN_TTL=3600
```

- `JWT_SECRET` : A secret key used to sign JWT tokens.
- `JWT_TOKEN_AUDIENCE` : Specifies the audience for the JWT token.
- `JWT_TOKEN_ISSUER` : The issuing authority of the token.
- `JWT_ACCESS_TOKEN_TTL` : Time to live for the token, in seconds (3600 seconds = 1 hour).

## JWT Configuration File

```ts
// auth/config/jwt.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    accessTokenTTL: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? "3600", 10),
  };
});
```

- The `registerAs` method is used to register a namespaced configuration object (`jwt` in this case).
- The JWT configuration includes values for `secret`, `audience`, `issuer`, and `accessTokenTTL`, all retrieved from the environment variables.

## Register JWT Module in the Auth Module

```ts
// auth/auth.module.ts
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig), // Load the JWT configuration
    JwtModule.registerAsync(jwtConfig.asProvider()), // Register JWT with configuration
  ],
})
export class Authmodule {}
```

- **`ConfigModule`** : Loads the JWT configuration using `forFeature()`, which allows you to scope the configuration to a specific module.
- **`JwtModule.registerAsync()`** : Asynchronously registers the JWT module with the configuration provider (`jwtConfig.asProvider()` is a helper function that simplifies setting up the configuration without writing boilerplate code).
