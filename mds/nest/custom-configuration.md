# Custom Configuration

Use custom configuration files in NestJS to handle environment variables, which allows you better organization and control over application settings.

## Table of Contents

- [Custom Configuration Files](#custom-configuration-files)
  - [Creating a Configuration File](#creating-a-configuration-file)
  - [Integrating the Config Module in the App](#integrating-the-config-module-in-the-app)
- [Config Files With Namespaces](#config-files-with-namespaces)
  - [Creating Namespaced Config Files](#creating-namespaced-config-files)
  - [Loading Configurations in App Module](#loading-configurations-in-app-module)

## Custom Configuration Files

Configuration files allow the extraction of environment variables and setting default values, making them more flexible and maintainable.

### Creating a Configuration File

```ts
// src/config/app.config.ts
export const appConfig = () => ({
  environment: process.env.NODE_ENV || "production",
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNC === "true" ? true : false,
    autoLoadEntities: process.env.DATABASE_AUTOLOAD === "true" ? true : false,
  },
});
```

`appConfig` is a factory function which returns an object containing the configuration settings.

### Integrating the Config Module in the App

```ts
// app.module.ts
import { ConfigModule, ConfigService } from "@nestjs/config";
import { appConfig } from "./config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? ".env" : `.env.${ENV}`,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        autoLoadEntities: configService.get("database.autoLoadEntities"),
        synchronize: configService.get("database.synchronize"),
        port: configService.get("database.port"),
        host: configService.get("database.host"),
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        database: configService.get("database.name"),
      }),
    }),
  ],
})
export class AppModule {}
```

- **ConfigModule:** loads the custom configurations - `load: [appConfig]` - and makes it globally accessible across the application.
- **TypeOrmModule:** Dynamically configures TypeORM using `ConfigService`, pulling values from our configuration file rather than directly from `process.env`.

## Config Files With Namespaces

Organize configuration files using namespaces in NestJS by splitting large configuration files into more manageable modules.

### Creating Namespaced Config Files

The `registerAs` function from `@nestjs/config` package is used to create named namespaces for each configuration.

`appConfig` _namespace:_

```ts
// src/config/app.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("appConfig", () => ({
  environment: process.env.NODE_ENV || "production",
}));
```

`database` _namespace containing database-related environment variables:_

```ts
// src/config/database.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNC === "true" ? true : false,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === "true" ? true : false,
}));
```

### Loading Configurations in App Module

The `load` array allows us to register multiple configuration files:

```ts
// app.module.ts
import { ConfigModule, ConfigService } from "@nestjs/config";
import appConfig from "./config/app.config";
import databaseConfig from "./config/database.config";

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? ".env" : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        autoLoadEntities: configService.get("database.autoLoadEntities"),
        synchronize: configService.get("database.synchronize"),
        port: configService.get("database.port"),
        host: configService.get("database.host"),
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        database: configService.get("database.name"),
      }),
    }),
  ],
})
export class AppModule {}
```

- **Namespaces:** By using the `ConfigService`, we access values under namespaces (`appConfig` and `database`), such as `database.host`, `database.port`, etc.
- **TypeORM Configuration:** The `TypeOrmModule` is dynamically configured using values from the `database` namespace, ensuring separation of configuration concerns.
