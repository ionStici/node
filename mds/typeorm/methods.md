# Repository Methods

Repositories provide a variety of methods to interact with the database.

## Table of Contents

- [Query Methods](#query-methods)
- [Methods for CRUD Operations](#methods-for-crud-operations)
- [Create and Manage Records](#create-and-manage-records)
- [Advanced Operations](#advanced-operations)
- [Soft Deletes](#soft-deletes)
- [Handling Pagination](#handling-pagination)

## Query Methods

#### `find(options?): Promise<Entity[]>`

```ts
// Query all records
const user = await userRepository.find();

// Query records that match given options
const users = await userRepository.find({ where: { isActive: true } });

// Query only specific columns using `select`
const users = await userRepository.find({ select: ["firstName", "lastName"] });
```

#### `findOne(options?): Promise<Entity | null>`

```ts
// Retrieves a single entity that matches the criteria.
const user = await userRepository.findOne({ where: { email } });
```

#### `findOneBy(where): Promise<Entity | null>`

```ts
//  A shorthand for `findOne` with only `where` condition.
const user = await userRepository.findOneBy({ id: 1 });
```

#### `findBy(where): Promise<Entity[]>`

```ts
// Retrieves multiple entities based on simple conditions.
const users = await userRepository.findBy({ role: "admin" });
```

## Methods for CRUD Operations

#### `save(entity | entities): Promise<Entity | Entity[]>`

```ts
// Inserts or updates entities in the database.
const newUser = userRepository.create(userData);
const savedUser = await userRepository.save(newUser);
```

_`create` vs. `save`:_

- `create()` : Instantiates a new entity object but does not save it to the database.
- `save()` : Inserts or updates the entity in the database.

#### `insert(entity | entities): Promise<InsertResult>`

```ts
// Inserts new entities without checking if they already exist.
await userRepository.insert(newUser);
```

#### `update(criteria, partialEntity): Promise<UpdateResult>`

```ts
// Updates entities that match the criteria.
await userRepository.update({ id: 1 }, { isActive: false });
```

#### `delete(criteria): Promise<DeleteResult>`

```ts
// Deletes entities that match the criteria.
await userRepository.delete({ id: 1 });
```

#### `remove(entity | entities): Promise<Entity | Entity[]>`

```ts
// Removes entities from the database. Unlike `delete`, `remove` requires entity instances.
const user = await userRepository.findOneBy({ id: 1 });
await userRepository.remove(user);
```

## Create and Manage Records

These methods are synchronous.

#### `create(entityLike): Entity`

```ts
// Creates a new entity instance from a plain object.
const newUser = userRepository.create(useData);
```

#### `merge(mergeIntoEntity, ...entityLikes): Entity`

```ts
// Merges multiple entities into one.
const mergedUser = userRepository.merge(existingUser, { firstName: "Jane" });
```

## Advanced Operations

#### `count(options?): Promise<number>`

```ts
// Counts the number of entities matching given options.
const activeUsersCount = await userRepository.count({
  where: { isActive: true },
});
```

#### `increment(conditions, propertyPath, value): Promise<UpdateResult>`

```ts
//  Increments a numeric column.
await userRepository.increment({ id: 1 }, "loginCount", 1);
```

#### `decrement(conditions, propertyPath, value): Promise<UpdateResult>`

```ts
// Decrements a numeric column.
await userRepository.decrement({ id: 1 }, "credit", 10);
```

Advanced Operations

## Soft Deletes

**Soft Delete:** Mark records as deleted without physically removing them from the database. Useful for preserving historical data or allowing deleted records to be restored later.

The `@DeleteDateColumn()` decorator automatically stores the timestamp of when the entity was soft deleted.

#### `softDelete(criteria): Promise<UpdateResult>`

```ts
// Marks the entity as deleted by setting the `deletedAt` column.
await userRepository.softDelete({ id: 1 });
```

#### `restore(criteria): Promise<UpdateResult>`

```ts
// Restores a soft-deleted entity by clearing the `deletedAt` column.
await userRepository.restore({ id: 1 });
```

#### Querying Records with Soft Deletes

```ts
// To include soft-deleted records, use the `withDeleted` option
const allUsers = await userRepository.find({ withDeleted: true });
```

```ts
// To query only soft-deleted records:
import { IsNull, Not } from "typeorm";

const deletedUsers = await userRepository.find({
  where: { deletedAt: Not(IsNull()) },
});
```

## Handling Pagination

_Implementing Pagination with Repositories._

- `skip` : The number of records to skip (acts as an offset).
- `take` : The number of records to retrieve (acts as a limit).

```ts
const users = await userRepository.find({
  skip: 10, // Skip the first 10 records
  take: 5, // Then take the next 5 records
});
```
