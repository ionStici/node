# Overview of Migrations in TypeORM

Migrations in TypeORM provide version control for the structure of your database, ensuring controlled and incremental updates, especially in production environments.

### 1. Why Migrations Are Needed

- **TypeORM** requires migrations because relational databases like PostgreSQL need a defined structure. Changes to this structure (e.g., adding a new column) must be carefully managed, especially in production.
- **MongoDB and NoSQL** databases do not need migrations since they don’t enforce a strict schema, allowing for flexible data structures.

### 2. Development Mode vs. Production

- In development, we use `synchronize: true` in TypeORM, which automatically synchronizes database schema changes with our TypeScript entities every time we make updates.
- **In production**, you cannot use synchronize because it might override your production database, leading to corruption or data loss. Instead, **migrations** are used to manage schema changes safely.

### 3. What are Migrations

- **Migrations** are essentially **version control** for your database structure. They track changes to the schema over time.
- Migration files store **incremental changes**. For example, if the first migration creates an entity with a `title` property, and in the next migration you add a `description` property, only the addition of `description` will be stored in the second migration.

### 4. How Migrations Work

- Migration files are organized in **sequence**, and each file contains a **timestamp** to track the order in which changes are applied.
- The **up** method contains the changes applied when the migration is run.
- The **down** method contains rollback queries that undo the changes in case of an error or if you need to revert the migration.

### 5. How Migrations Are Generated

- TypeORM provides a command that compares your **PostgreSQL database** with the current **entity files** in your application.
- If there are differences between the database and the entities, TypeORM creates a new migration file that contains only the incremental changes needed to bring the database in sync with the entities.

### 6. Running and Rolling Back Migrations

- When you run a migration, TypeORM applies the **up** method to update the database.
- If needed, you can **rollback** a migration using the **down** method, which undoes the changes made by the migration.

### 7. Limitations with NestJS

- NestJS does not have **native integration** with TypeORM migrations. Therefore, to run migrations in a production environment, you need to create a separate **data source file**. This file contains the database configuration details for the production server.
- Make sure to exclude this data source file from Git to avoid exposing sensitive database credentials.

### 8. Summary

- Migrations help manage schema changes in production by creating structured updates to the database.
- You can version control the state of your database, apply updates incrementally, and safely rollback if needed.
