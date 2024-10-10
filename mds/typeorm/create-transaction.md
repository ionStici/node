# Implementing Transactions

## Table of Contents

- [Steps for Implementing Transactions](#steps-for-implementing-transactions)
- [Creating a new Transaction](#creating-a-new-transaction)
- [Same Example with Exception Handling](#same-example-with-exception-handling)

## Steps for Implementing Transactions

- In TypeORM, database transactions are managed using the Query Runner class.
- A transaction is a series of interrelated CRUD operations that either succeed together or fail together.
- If any part of the transaction fails, all operations are rolled back, ensuring data consistency.

### 1. Create a Query Runner Instance

Use the `DataSource` object to instantiate a `queryRunner`.

```ts
const queryRunner = this.dataSource.createQueryRunner();
```

### 2. Connect the Query Runner to the Data Source

Establish a connection to the database by calling the `connect` method.

```ts
await queryRunner.connect();
```

### 3. Start the Transaction

Use the `startTransaction` method to begin a new transaction.

```ts
await queryRunner.startTransaction();
```

### 4. Perform CRUD Operations

Within the transaction, perform the necessary operations.

```ts
const newUser = queryRunner.manager.create(User, user);
const result = await queryRunner.manager.save(newUser);
```

### 5. Commit or Rollback the Transaction

Use a `try...catch...finally` block to handle the transaction outcome.

**Commit the Transaction:** If all operations succeed, commit the transaction using the `commitTransaction` method:

```ts
await queryRunner.commitTransaction();
```

**Rollback the Transaction:** If any operation fails, catch the error and rollback using the `rollbackTransaction` method:

```ts
await queryRunner.rollbackTransaction();
```

### 6. Release the Connection

After the transaction is completed (whether successfully or not), release the connection back to the pool using the `release` method.

```ts
await queryRunner.release();
```

## Creating a new Transaction

```ts
// users/providers/users-create-many.provider.ts
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";
import { User } from "../user.entity";

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];

    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    // Connect Query Runner to data source
    await queryRunner.connect();

    // Start Transaction
    await queryRunner.startTransaction();

    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If successful, commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // if unsuccessful, rollback
      await queryRunner.rollbackTransaction();
    } finally {
      // Release the connection
      await queryRunner.release();
    }

    return newUsers;
  }
}
```

- `createQueryRunner`: Creates a new `queryRunner` instance.
- `connect`: Establishes a connection to the database.
- `startTransaction`: Begins the transaction.
- `commitTransaction`: Commits the transaction if all operations are successful.
- `rollbackTransaction`: Rolls back all changes if any operation fails.
- `release`: Releases the database connection.

## Same Example with Exception Handling

```ts
import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";
import { User } from "../user.entity";

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];

    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Connect Query Runner to data source
      await queryRunner.connect();

      // Start Transaction
      await queryRunner.startTransaction();
    } catch (e) {
      throw new RequestTimeoutException("Could not connect to the database");
    }

    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If successful, commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // if unsuccessful, rollback
      await queryRunner.rollbackTransaction();

      throw new ConflictException("Could not complete the transaction", {
        description: String(error),
      });
    } finally {
      try {
        // Release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException("Could not release the connection", {
          description: String(error),
        });
      }
    }

    return newUsers;
  }
}
```
