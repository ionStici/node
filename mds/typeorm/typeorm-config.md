# Configure TypeORM with PostgreSQL in NestJS

## Table of Contents

- [What is TypeORM](#what-is-typeorm)
- [Install Required packages for a NestJS Project](#install-required-packages-for-a-nestjs-project)
- [Configure TypeORM with PostgreSQL in a NestJS Project](#configure-typeorm-with-postgresql-in-a-nestjs-project)
- [Asynchronous Configurations](#asynchronous-configurations)

## What is TypeORM

**Object-Relational Mapping (ORM)** is a programming technique that abstracts database interactions, allowing developers to work with databases using familiar object-oriented concepts instead of raw SQL.

**TypeORM** is an **Object Relational Mapper (ORM)** for TypeScript and JavaScript applications. It enables you to work with databases like PostgreSQL using TypeScript classes and decorators, providing a seamless integration between your application code and the database.

### Resources

- [TypeORM Website](https://typeorm.io)
- [TypeORM GitHub](https://github.com/typeorm/typeorm)
- [NestJS : SQL (TypeORM)](https://docs.nestjs.com/recipes/sql-typeorm)

## Install Required packages for a NestJS Project

```bash
npm i typeorm @nestjs/typeorm pg
```

- `typeorm` : The core TypeORM library.
- `@nestjs/typeorm` : NestJS integration with TypeORM.
- `pg` : PostgreSQL driver for Node.js

## Configure TypeORM with PostgreSQL in a NestJS Project

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "12345",
      database: "my-blog",
      // entities: [User],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

_Configurations:_

- `TypeOrmModule` : Used to integrate TypeORM into a NestJS project.
- `TypeOrmModule.forRoot()` : This method establishes a connection to the PostgreSQL database using the provided configuration settings.

_Configuration Options:_

- `type` : The type of the database we're using (`postgres` for PostgreSQL).
- `entities` : An array of entities that make up the database.
- `autoLoadEntities: true` : Automatically loads all entities that are connected to their module.
- `synchronize` : When `true`, TypeORM automatically creates database tables based on your entities. Should be used only in development, disable in production to avoid data loss.

_Database Configuration:_

- `host` : The hostname of your database server (`localhost` for local development).
- `port` : The port for the database connection (`5432` is the default port for PostgreSQL).
- `username` : The username used to authenticate with the database.
- `password` : The password for the database user.
- `database` : The name of the database you want to connect to.

## Asynchronous Configurations

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "12345",
        database: "my-blog",
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
```

- `TypeOrmModule.forRootAsync()` : Provides the TypeORM configuration asynchronously. Useful when the configuration depends on other services or environment variables.
- `useFactory` : Returns the configuration object that will be used for connecting to the database.
- `imports` and `inject` : These properties allow you to import other modules and inject services that are required to create the configuration.
