# Database Relations

## Table of Contents

- [Relationships in Relational Databases](#relationships-in-relational-databases)
- [One-To-One (1:1) Relationship](#one-to-one-11-relationship)
  - [Uni-directional One To One Relationship](#uni-directional-one-to-one-relationship)
  - [Creating a row with Relationships](#creating-a-row-with-relationships)
- [Cascade Creation with Relationships](#cascade-creation-with-relationships)

## Relationships in Relational Databases

_Relational databases, like PostgreSQL and MySQL, have key advantages:_

1. **Avoids Duplicate Data:** Relationships between tables help minimize data redundancy by separating related data into different tables.
2. **Data Accuracy:** Constraints on columns enforce validation, ensuring only accurate and valid data is stored.
3. **Scalability:** Flexibility in adding tables and relationships over time as the application grows.

_Types of relationships:_

- **One-to-One (1:1):** Each entity has only one counterpart in another table (e.g., a post has a single set of meta options).
- **One-to-Many (1) and Many-to-One (N:1):** An author can have multiple posts, while each post is linked to a single author.
- **Many-to-Many (N):** Posts and tags, where a post can have multiple tags and a tag can relate to multiple posts.

These relationships help organize and interlink data efficiently.

## One-To-One (1:1) Relationship

In a **one-to-one (1:1) relationship**, each record in one table is linked to one and only one record in another table.

To implement a **1:1 relationship:** The primary key from one table is used as a **foreign key** in another.

In TypeORM, **1:1 relationships** can be either **unidirectional** (only one table knows about the relationship) or bidirectional (both tables know about the relationship).

### Uni-directional One To One Relationship

```ts
// post.entity.ts
import { MetaOption } from "src/meta-options/meta-option.entity";
import { Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Post {
  @JoinColumn()
  @OneToOne(() => MetaOption)
  metaOptions?: MetaOption;
}
```

- **One-to-One Relationship:**
  - `@OneToOne` decorator sets a 1-to-1 relationship between `Post` and `MetaOption`.
  - The decorator takes a function that returns the entity (`MetaOption`) for the relationship.
- **Join Column:**
  - `@JoinColumn` is used to specify where the foreign key should be placed.
  - Adding `@JoinColumn` to `Post` creates a `metaOptionsId` foreign key column in the `Post` table, referencing the `MetaOption` entity.

In a **unidirectional 1-to-1 relationship**, only the `Post` entity references the `MetaOption` entity, and the foreign key is created in the `Post` table.

### Creating a row with Relationships

```ts
import { Body, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,

    @InjectRepository(SubTodo)
    private readonly subTodoRepository: Repository<SubTodo>
  ) {}

  // IMPORTANT: EXAMPLE WITHOUT CASCADE
  public async create(@Body() todoDto: TodoDto) {
    // Create SubTodo if it is provided in the DTO
    let subTodo = null;
    if (todoDto.subTodo) {
      subTodo = this.subTodoRepository.create(todoDto.subTodo);
      subTodo = await this.subTodoRepository.save(subTodo);
    }

    // Create Todo using the provided data
    const todo = this.todoRepository.create({
      ...todoDto,
      subTodo: subTodo ? subTodo : null,
    });

    // Save Todo, which now includes the reference to SubTodo (foreign key relationship)
    return await this.todoRepository.save(todo);
  }
}
```

1. **Injecting Repositories:** The `TodoService` injects both `Todo` and `SubTodo` entities using `@InjectRepositories`, enabling direct access to TypeORM repository methods for database operations, through `todoRepository` and `subTodoRepository` interfaces. These interfaces provide methods for interacting with the entities in the database, such as `create`, `save`, `find`, etc.

2. **Creating the SubTodo (Foreign Key):** If `subTodo` is provided in `TodoDto`, it is instantiated with `this.subTodoRepository.create(todoDto.subTodo)` and saved with `await this.subTodoRepository.save(subTodo)`.

3. **Creating Todo with the Relationship:** The `Todo` entity is instantiated with `this.todoRepository.create(todoDto)`. If a `SubTodo` is created, it is assigned to `todo.subTodo`, establishing the relationship.

4. **Saving Todo:** `await this.todoRepository.save(todo)` saves the `Todo` entity, including the foreign key (`subTodoId`). The foreign key column `subTodoId` in the `Todo` table is automatically populated by TypeORM based on the `@OneToOne` and `@JoinColumn()` decorators defined in the entity, linking the `Todo` to the `SubTodo`.

## Cascade Creation with Relationships

The `cascade` feature in TypeORM allows linked entities to be automatically handled during operations such as insert, update, or delete.

```ts
import { SubTodo } from "src/sub-todo/sub-todo.entity";
import { Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Todo {
  // ... other columns

  @JoinColumn()
  @OneToOne(() => SubTodo, { cascade: true })
  subTodo?: SubTodo;
}
```

- `@OneToOne` : Establishes a one-to-one relationship between `Todo` and `SubTodo`.
- `cascade: true` : Enables cascading for operations such as `insert`, `update`, `delete` and more. This means when a `Todo` entity is saved, any linked `SubTodo` entity will also be automatically created or updated.

```ts
@Injectable()
export class TodoService {
  public async create(@Body() todoDto, TodoDto) {
    // Create todo with subTodo directly
    const todo = this.todoRepository.create(todoDto);
    return await this.todoRepository.save(todo);
  }
}
```

- **Create and Save Post:** With `cascade: true` set in the `@OneToOne` decorator, when `todoRepository.save(todo)` is called, it not only creates the `Todo` entity but also automatically creates the linked `SubTodo` entity if it is included in `todoDto`.

### Foreign Key Creation

- When cascading, **foreign keys** are handled automatically by TypeORM. Specifically, when you use the `@JoinColumn` decorator in the `Todo` entity, a column named `subTodoId` is automatically generated in the `todo` table to hold the reference to the linked `SubTodo`.
- When saving a `Todo` instance, TypeORM creates the `subTodo` entity first (if it's new), then uses its primary key to set the foreign key `subTodoId` in the `todo` table.

This cascade behavior simplifies code, allowing you to avoid explicit creation and linking of related entities manually.
