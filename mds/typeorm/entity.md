# Entity

## Table of Contents

- [Creating an Entity](#creating-an-entity)
- [`@Column()` Options](#column-options)
- [Special Columns](#special-columns)

## Creating an Entity

An **Entity** is a **representation of a database table**. In TypeORM, entities are TypeScript classes with decorators that define table columns and properties.

```ts
// users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 96,
    nullable: false,
    unique: true,
  })
  username: string;
}
```

- `@Entity()` : Decorator that marks the class as an entity.

- `@PrimaryGeneratedColumn()` : Denotes a primary key that auto-increments.

- `@PrimaryColumn({ type: "uuid" })` : Marks a property as a primary key column.

- `@Column()` : Defines a regular column in the table.

- **Options:** Columns in an entity can be customized by passing a **configuration object** to the `@Column({})` decorator.

## `@Column()` Options

[**Doc:** Available Column Options](https://typeorm.io/entities#column-options)

- `type` : Specifies the column data type (e.g. `varchar`, `int`, `boolean`).

- `length` : Sets the length for string-based columns.

- `nullable` : Specifies whether the column can be `NULL`.

- `default` : Sets a default value.

- `unique` : Enforces uniqueness for the column.

- `enum` : Defines an enumeration type.

- `select` : Excludes the column from query results if set to `false`.

- `comment` : Adds a database comment to the column.

### Column Types

[**Doc:** Column types for `postgres`](https://typeorm.io/entities#column-types-for-postgres)

- `string` types: `'varchar'`, `'text'`
- `number` types: `'int'`, `'float'`, `'double'`
- `date` types: `'date'`, `'timestamp'`
- `boolean` types: `'boolean'`
- `json` types: `'json'`, `'jsonb'` (PostgreSQL)

## Special Columns

[**Decorator Reference**](https://orkhan.gitbook.io/typeorm/docs/decorator-reference)

```ts
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
} from "typeorm";

@Entity()
export class Users {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;
}
```

- `@CreateDateColumn()` : Automatically sets the column to the creation timestamp.
- `@UpdateDateColumn()` : Automatically updates the column to the current timestamp whenever the entity is updated.
- `@DeleteDateColumn()` : Used for soft deletes, stores the timestamp when the entity was deleted.
- `@VersionColumn()` : Implements optimistic locking by incrementing a version number on each update.
