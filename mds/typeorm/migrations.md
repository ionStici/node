# Migrations

## Setting Up and Running Migrations in TypeORM for NestJS

In the root of the project, create a new file called `typeorm-cli.config.ts`. This file will be used by TypeORM to handle migrations.

```ts
// typeorm-cli.config.ts
import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "db-name",
  entities: ["**/*.entity.js"],
  migrations: ["migrations/*.js"],
});
```

Inside the `src` folder, create a directory called `migrations` to hold your migration files:

```bash
mkdir src/migrations
```

Build the project before running migrations:

```bash
npm run start
```

Generate the first migration:

```bash
npx typeorm migration:generate src/migrations/firstMigration -d dist/typeorm-cli.config
```

TypeORM will compare your database schema with the entity files and generate a migration file with only the necessary changes.

The migration file will have two methods: `up` that contains the SQL queries to create the necessary tables and changes, and `down` that contains the rollback queries that reverse the changes made in the up method.

## Running Migrations in Production

```bash
# 1: Build the project
npm run build

# 2: Generate migration
npx typeorm migration:generate src/migrations/firstMigration -d dist/typeorm-cli.config
```

Considering that the PostgreSQL database on the server is empty, the above command will create a migration file in the `src/migrations` directory. Register the newly created migration class in the `typeorm-cli.config.ts` file

```ts
// /typeorm-cli.config.ts
import { DataSource } from "typeorm";
import { FirstMigration1729588780071 } from "./src/migrations/1729588780071-firstMigration.ts";

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "nestblog",
  entities: ["**/*.entity.js"],
  migrations: [FirstMigration1729588780071],
});
```

```bash
# rebuild the app to reflect the updated configuration
npm run build

# apply the migration to the production database
npx typeorm migration:run -d dist/typeorm-cli.config
```

Verify if the migration succeeded by checking the database tables inside PostgreSQL.
