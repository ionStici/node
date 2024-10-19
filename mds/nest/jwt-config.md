# Configuring JWT in NestJS

## Install NestJS JWT Package

```ts
npm i @nestjs/jwt
```

## Set Up Environment Variables

```makefile
# .env.development
JWT_SECRET=86df14a9a5850a6147d5bdb6e31eb7c549a98b
JWT_TOKEN_AUDIENCE=localhost:5173
JWT_TOKEN_ISSUER=localhost:3000
JWT_ACCESS_TOKEN_TTL=3600
JWT_REFRESH_TOKEN_TTL=86400
```

- `JWT_SECRET` : A secret key used to sign JWT tokens.
- `JWT_TOKEN_AUDIENCE` : Who the token is for.
- `JWT_TOKEN_ISSUER` : Where the token came from.
- `JWT_ACCESS_TOKEN_TTL` : Time to live for the token (in seconds).
- `JWT_REFRESH_TOKEN_TTL` : Time to live for the refresh token.

### JWT Configuration File

```ts
// src/config/jwt.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  accessTokenTTL: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? "3600", 10),
  refreshTokenTTL: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? "864000", 10),
}));
```

## Register the JWT Module

```ts
// app.module.ts
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig), // Load the JWT Configuration
    JwtModule.registerAsync(jwtConfig.asProvider()), // Register JWT with configuration
  ],
})
export class AppModule {}
```

- `ConfigModule.forFeature(jwtConfig)` : Loads the JWT configuration. `forFeature` scopes the configuration to the module.

- `JwtModule.registerAsync(jwtConfig.asProvider())` : Asynchronously registers the JWT module using the configuration provided.
