# Many To Many Relationships

## Table of Contents

- [Introduction](#introduction)

## Introduction

In a **many-to-many relationship**, two entities (e.g., `Tag` and `Post`) are connected such that:

- Each `Tag` can be associated with many `Posts`.
- Each `Post` can have multiple `Tags`.

Since it's not feasible to store a foreign key in either of the original tables for many-to-many relationships, **a separate junction table** is created. This table holds references to the primary keys of both related tables, thus managing the relationships. In SQL databases, this is handled by having rows that store the foreign keys for both entities, linking them together.

**TypeORM** provides decorators (`@ManyToMany`, `@JoinTable`) to set up these kinds of relationships programmatically. Similar to one-to-many relationships, **many-to-many relationships** can also be **unidirectional** or **bidirectional**. A unidirectional relationship means only one of the entities is aware of the relationship, whereas a bidirectional relationship means both entities reference each other.

## Uni-directional Many-to-Many

```ts
// post.entity.ts
import { Tag } from "src/tags/tag.entity";

@Entity()
export class Post {
  // ...

  @JoinTable()
  @ManyToMany(() => Tag)
  tags?: Tag[];
}
```
