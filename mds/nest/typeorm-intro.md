# TypeORM and SQL Databases

## Table of Contents

- [TypeORM Introduction](#typeorm-introduction)
- [Connecting NestJS to PostgreSQL with TypeORM](#connecting-nestjs-to-postgresql-with-typeorm)
  - [Install Required Packages](#install-required-packages)
  - [Configure TypeORM in NestJS](#configure-typeorm-in-nestjs)
  - [Async TypeORM Configuration](#async-typeorm-configuration)
- [The Repository Pattern in TypeORM](#the-repository-pattern-in-typeorm)
  - [Overview](#overview)
  - [Entities Explained](#entities-explained)
  - [Repositories Explained](#repositories-explained)
  - [Repository Pattern Workflow](#repository-pattern-workflow)
  - [Summary](#summary)

## TypeORM Introduction

**Object-Relational Mapping (ORM)** is a programming technique that abstracts database interactions, allowing developers to work with databases using familiar object-oriented concepts instead of raw SQL.

**TypeORM** is an **Object Relational Mapper (ORM)** for TypeScript and JavaScript, it helps developers interact with relational databases using an object-oriented approach, reducing the need to write raw SQL queries.

_Resources:_

- [NestJS : SQL (TypeORM)](https://docs.nestjs.com/recipes/sql-typeorm)
- [TypeORM GitHub](https://github.com/typeorm/typeorm)
- [TypeORM Website](https://typeorm.io)

## Connecting NestJS to PostgreSQL with TypeORM

### Install Required Packages

```bash
npm i typeorm @nestjs/typeorm pg
```

1. `typeorm` : the main ORM library.
2. `@nestjs/typeorm` : the NestJS-specific bindings for TypeORM.
3. `pg` : the PostgreSQL driver for Node.js

### Configure TypeORM in NestJS

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      // entities: [],
      autoLoadEntities: true,
      synchronize: true,
      port: 5432,
      username: "postgres",
      password: "12345",
      host: "localhost",
      database: "nestjs-blog",
    }),
  ],
})
export class AppModule {}
```

_Configuration:_

- `TypeOrmModule` : used to integrate TypeORM into a NestJS project.
- `TypeOrmModule.forRoot()` : this method establishes a connection to the PostgreSQL database using the provided configuration settings.

_Configuration Options:_

- `type` : Specifies the type of database we’re using (`postgres` for PostgreSQL).
- `host` : The hostname of your database server (`localhost` for local development).
- `port` : The port for the database connection (`5432` is the default port for PostgreSQL).
- `username` : The username used to authenticate with the database (e.g., `"postgres"`).
- `password` : The password for the database user.
- `database` : The name of the database you want to connect to (e.g., `"nestjs-blog"`).
- `entities` : An array of entities that represent the database tables.
- `autoLoadEntities: true` : automatically loads all entities that are connected to their module.
- `synchronize` : Set to `true` for development to automatically create the database schema based on your entities.

  Do not use `synchronize` in production, as it can cause data loss.

_Synchronize Options:_

- The `synchronize: true` option is very useful during development, as it automatically updates your database schema whenever you make changes to your entities. However, **never use it in production**, as it may lead to unintended loss of data. For production, use **migrations** to manage schema changes safely.

### Async TypeORM Configuration

How to convert a **synchronous database connection** to an **asynchronous one** using TypeORM in NestJS. This approach provides better flexibility for injecting configuration values, such as reading settings from environment variables (`.env` files).

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
        entities: [],
        synchronize: true,
        port: 5432,
        username: "postgres",
        password: "12345",
        host: "localhost",
        database: "nestjs-blog",
      }),
    }),
  ],
})
export class AppModule {}
```

_Changes:_

- `TypeOrmModule.forRootAsync()` : this is used instead of `forRoot()` to allow **asynchronous configuration**.
- `useFactory` : allows you to return a configuration object that will be used for connecting to the database.
- `imports` and `inject` : these properties allow you to import other modules and inject services that are required to create the configuration.

_Why Use Async Configuration?_

- **Environment Variables:** Async configuration allows you to **read environment variables** for sensitive settings, like database credentials, instead of hardcoding them.
- **Security:** Environment variables in `.env` files are generally safer, as they are often hidden and have limited access.
- **Flexibility:** You can inject services like a **configuration service** for more dynamic and secure settings management.

## The Repository Pattern in TypeORM

### Overview

1. **Entity:**
   - Represents a **database table**.
   - Defines **columns** and their properties for a specific table.
   - An **entity file** contains the structure of the table in the form of a class.
   - Example: a `User` entity represents the `users` table.

<div></div>

2. **Repository:**
   - The repository is used to **interact** with the database through the **entity**.
   - You do **not create** repository files manually. TypeORM generates them for you.
   - Repositories are injected into services to access database methods.

### Entities Explained

An **entity** in TypeORM is a class that represents a table in your database. Consider a `UserEntity` that defines the structure of a `users` table:

```ts
// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn() // Marks this column as the primary key and auto-generates IDs
  id: number;

  @Column() // Defines a column in the table
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true }) // Adds a default value for new records
  isActive: boolean;
}
```

- `@Entity()` Decorator: Marks the class as an entity, linking it to a table in the database.
- `@PrimaryGeneratedColumn()` : Marks a column as the primary key that is auto-generated.
- `@Column()` : Converts properties into database columns.

### Repositories Explained

A **repository** is how you interact with the database through the entity. It allows you to:

- Query data (e.g., `find`, `findOne`)
- Insert, update, or delete records.

TypeORM **injects** repositories into your services using dependency injection:

```ts
// users.service.ts
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {}

  // Example: Find all users
  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }
}
```

- `@InjectRepository()` : Injects a repository that corresponds to the specified entity (`UserEntity` in this case).
- **Repository Methods:** - `find()` : Retrieves all records from the table. - You can also use other methods like `save()`, `delete()`, `update()`, etc.

### Repository Pattern Workflow

1. **Define an Entity:**
   - Create a class to represent the table.
   - Use decorators to specify columns, primary keys, etc.
2. **Inject the Repository:**
   - Inject the repository using `@InjectRepository(EntityName)` inside your service.
   - TypeORM automatically manages the creation of the repository.
3. **Use the Repository for Database Interaction:**
   - The injected repository (`usersRepository` in this example) is used to perform CRUD operations.

### Summary

- **Entity:** Defines a table structure.
- **Repository:** Provides methods to interact with the database using the entity.
- **Service:** Injects the repository and contains business logic to interact with the database.
