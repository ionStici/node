# One-to-Many (1:N) and Many-to-One (N:1)

## Definition

**One-to-Many (1:N)** : One record in entity A is related to multiple records in entity B. An `Author` has many `Posts`.

**Many-to-One (N:1)** : Many records in entity A related to one record in entity B. Each `Post` belongs to one `Author`.

## Creating the Relationship

```ts
// author.entity.ts
import { Entity, ManyToOne } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Author {
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
```

```ts
// post.entity.ts
import { Entity, ManyToOne } from "typeorm";
import { Author } from "./author.entity";

@Entity()
export class Post {
  @ManyToOne(() => Author, (author) => author.posts)
  author: Author;
}
```

**`@OneToMany()`** in `Author`:

- First Argument: `() => Post` - The related entity.
- Second Argument: `(post) => post.author` - The inverse property in `Post`.

**`@ManyToOne()`** in `Post`:

- First Argument: `() => Author` - The related entity.
- Second Argument: `(author) => author.posts` - The inverse property in `Author`.

The `ManyToOne` side is the **owning side** and contains the foreign key column `authorId`. No need for `@JoinColumn()` decorator here.
