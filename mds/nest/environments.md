# Managing Environments in NestJS with ConfigModule

## Table of Contents

- [Why ConfigModule](#why-configmodule)
- [Installing ConfigModule](#installing-configmodule)
- [Set Up ConfigModule](#set-up-configmodule)
- [Access Environment Variables](#access-environment-variables)
- [Conditionally Load Environments](#conditionally-load-environments)
- [Inject Database Credentials](#inject-database-credentials)

## Why Config Module

- **Environment Separation:** Different settings for development, testing, and production.
- **Security:** Keep sensitive information like database credentials out of your codebase.
- **Maintainability:** Change configurations without altering the source code.

## Installing ConfigModule

```bash
npm i @nestjs/config
```

## Set Up ConfigModule

```ts
// app.module.ts
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

- `ConfigModule.forRoot()` : initializes the module.
- `isGlobal: true` : Allows you to inject `ConfigService` anywhere without importing `ConfigModule` again.

### Create Environment Variables File

Create a `.env` file at the root of the project.

```makefile
# .env
DATABASE_PASSWORD='supersecret'
```

## Access Environment Variables

```ts
// app.service.ts
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  test() {
    return this.configService.get("DATABASE_PASSWORD", "default_value"); // 'supersecret'
  }
}
```

Use `configService.get('VAR_NAME')` to retrieve environment variables.

## Conditionally Load Environments

### Set `NODE_ENV` in Scripts

```json
{ "scripts": { "start:dev": "NODE_ENV=development nest start --watch" } }
```

`process.env` will get access to the `NODE_ENV` property.

### Create Environment Files

```makefile
# .env
DATABASE_PASSWORD="secret"
```

```makefile
# .env.development
DATABASE_PASSWORD="12345"
```

### Update ConfigModule to Load Conditionally

```ts
// app.module.ts
import { ConfigModule } from "@nestjs/config";

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: [".env.development"], // manually
      envFilePath: !ENV ? ".env" : `.env.${ENV}`, // conditionally
    }),
  ],
})
export class AppModule {}
```

- If `NODE_ENV` is not set, defaults to `.env`.
- If `NODE_ENV` is set (e.g. `development`), loads `.env.development`.

## Inject Database Credentials

### Define Database Environment Variables

```makefile
# .env.development
DATABASE_PORT=5432
DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_PASSWORD=12345
DATABASE_NAME="nestjs-blog"
```

### Update AppModule to Use ConfigService with TypeORM

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? ".env" : `.env.${ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        autoLoadEntities: true,
        synchronize: true,
        port: +configService.get("DATABASE_PORT"),
        host: configService.get("DATABASE_HOST"),
        username: configService.get("DATABASE_USER"),
        password: configService.get("DATABASE_PASSWORD"),
        database: configService.get("DATABASE_NAME"),
      }),
    }),
  ],
})
export class AppModule {}
```

- **`TypeOrmModule.forRootAsync`** : Asynchronously configure TypeORM with environment variables.
- **Imports and Inject**: Import `ConfigModule` and inject `ConfigService`.
- **`useFactory` Function** : Access environment variables via `configService`.
