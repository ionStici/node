# Custom Configuration

Handle environment variables using custom **configuration files** for better organization and control over app settings.

## Creating a Configuration File

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
    autoLoadEntities: process.env.DATABASE_AUTO_LOAD === "true" ? true : false,
  },
});
```

`appConfig` is a factory function which returns an object containing the configuration settings.

### Integrating a Configuration File

```ts
// app.module.ts
import { ConfigModule, ConfigService } from "@nestjs/config";
import { appConfig } from "./config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? ".env" : `.env.${ENV}`,
      load: [appConfig], // load config file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // retrieve config settings from config file
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

- `ConfigModule` loads the custom configurations `load: [appConfig]` and makes it globally accessible across the application.
- `TypeOrmModule` uses configuration settings from the configuration file rather than directly from `process.env`.

## Split Config Files using Namespaces

### Creating Namespaced Config Files

The `registerAs` function from `@nestjs/config` package is used to create namespaces.

```ts
// src/config/app.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("appConfig", () => ({
  environment: process.env.NODE_ENV || "production",
}));
```

`database` namespace containing database-related environment variables:

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
  autoLoadEntities: process.env.DATABASE_AUTO_LOAD === "true" ? true : false,
}));
```

### Integrating Named Config Files

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

- **Namespaces:** By using the `ConfigService` provider, we can access values under namespaces (`appConfig` and `databaseConfig`), such as `database.host`, `database.port`, etc.
- **TypeORM Configuration:** The `TypeOrmModule` is dynamically configured using values from the `database` namespace, ensuring separation of configuration concerns.
