# draft

## Table of Contents

- [TypeORM Querying](#typeorm-querying)
  - [Query without Relations](#query-without-relations)
  - [Query with Relations](#query-with-relations)
  - [Eager Loading in Entity Definition](#eager-loading-in-entity-definition)
  - [Difference](#difference)

## TypeORM Querying

### Query without Relations

```ts
const todo = await this.todoRepository.find();
```

- Retrieves all `Todo` entries without any associated entities.
- Useful when you don't need related data and want faster queries.

### Query with Relations

```ts
const todo = await this.todoRepository.find({
  relations: { subTodo: true },
});
```

- Fetches `Todo` entries along with related `subTodo` entities.
- `relations` : Specifies which related entities to load, in this case, `subTodo`.

### Querying a Single Entry

```ts
const todo = await this.todoRepository.findOneBy({ id });
```

- `findOneBy` : Retrieves a single `Todo` entry based on a condition.
- `{ id }` : Looks for a `Todo` with the given `id`.
- **Use Case:** This is useful when you need a specific item and know its unique identifier. It ensures efficiency as only one matching record is fetched.

### Eager Loading in Entity Definition

```ts
@OneToOne(() => SubTodo, { eager: true })
subTodo?: SubTodo;
```

```ts
// Includes relations by default
const todo1 = await this.todoRepository.find();
```

- **Eager Loading:** Automatically loads the related `subTodo` entity whenever a `Todo` is queried.
- `eager: true` : Ensures that every time you query the `Todo` entity, the linked `subTodo` entity is included by default.
- **Use Case:** Useful when related data is always needed, reducing the need to specify relations explicitly during every query.

### Difference

- Using `relations` in a query provides **flexibility** to decide when related data should be included.
- **Eager loading** automatically includes related data, making it convenient but less flexible since related data is always fetched.

## Deleting an Entry

```ts
@Injectable()
export class TodoService {
  // ...

  public async delete(id: number) {
    // Find the todo
    const todo = await this.todoRepository.findOneBy({ id });

    // Throw error if todo not found
    if (!todo) {
      throw new Error("Todo not found");
    }

    // Delete the todo
    await this.todoRepository.delete(todo);

    // Delete subTodo relation if it exists
    if (todo.subTodo) {
      await this.subTodoRepository.delete(todo.subTodo.id);
    }

    // Send Confirmation
    return { deleted: true, id };
  }
}
```
