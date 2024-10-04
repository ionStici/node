# One-To-Many & Many-To-One Relationships

## Table of Contents

- [Introduction](#introduction)
  - [User and Post Example](#user-and-post-example)
  - [Foreign Key Placement](#foreign-key-placement)
  - [Bidirectional Relationship](#bidirectional-relationship)
  - [Key Notes](#key-notes)
- [Implementing One-to-Many and Many-to-One Relationships](#implementing-one-to-many-and-many-to-one-relationships)
  - [Setting Up the Relationship](#setting-up-the-relationship)
- [Working with One-to-Many & Many-to-One](#working-with-one-to-many--many-to-one)
- [The Foreign Key in One-to-Many](#the-foreign-key-in-one-to-many)

## Introduction

In a **One-to-One** and **Many-to-One** relationship, two entities interact in such a way that one entity is associated with multiple records in the other entity, while the second entity points back to just one record in the first.

### User and Post Example

- A **User** can have **many Posts** - this is a **One-to-Many** relationship.
- Each **Post** is associated with exactly **one User** - this is a **Many-to-One** relationship.

### Foreign Key Placement

- The **foreign key** always resides on the side of the **Many-to-One** relationship.
- In the above example, the **Post** entity contains a `userId` foreign key pointing to the **User** entity.
- Since the foreign key lies on the **Many-to-One** side, `@JoinColumn` is not explicitly required, as TypeORM automatically infers the relationship in this case.

### Bidirectional Relationship

- Typically, **One-to-Many** and **Many-to-One** relationships are represented as **bidirectional**. This allows navigating in both directions: from **User** to their **Posts**, and from a **Post** to its **User**.
- For a **bidirectional** relationship, both entities reference each other.
  - In the **User** entity, there would be a **One-to-Many** relation pointing to multiple posts.
  - In the **Post** entity, a **Many-to-One** relation would link back to the user.

### Key Notes

- **One-to-Many** and **Many-to-One** relationships are **bidirectional** by default because they make sense in both directions - e.g. you may need to get all posts by a user or know which used authored a specific post.
- If only a **Many-to-One** relationship is defined, it is **unidirectional**, meaning you can navigate only from a **Post** to the **User**, but not vice versa.

## Implementing One-to-Many and Many-to-One Relationships

```ts
// user.entity.ts
import { Post } from "src/posts/post.entity";
import { Entity, OneToMany } from "typeorm";

@Entity()
export class User {
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
```

- A `user` can have multiple `posts`, this is represented using the `@OneToMany` decorator.
- The relationship type is `Post[]`, indicating that this property holds an array of posts.

```ts
// post.entity.ts
import { Entity, ManyToOne } from "typeorm";
import { User } from "src/users/user.entity";

@Entity()
export class Post {
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;
}
```

- Each `post` is authored by a single user (denoted by the `author` property).
- The `@ManyToOne` decorator defines that **many posts** are associated with **one user**.
- The `author` property is defined as `User`.

### Setting Up the Relationship

_Foreign Key:_

- The foreign key always lies on the **many-to-one** side of the relationship.
- In this example, the `authorId` column will be added to the **Post** table, referencing the **User** table. THis allows every post to be mapped back to a user.

_Bidirectional Relationship:_

- The relationship is bidirectional, meaning: From the **User** side, you can access all related `posts`. From the **Post** side, you can access the user who is an `author`.
- The second argument in both `@OneToMany` and `@ManyToOne` points to the **inverse property** on the other entity. This ensures that navigation is possible in both directions.

## Working with One-to-Many & Many-to-One

Create a new post and assign it an author by using the establishment **One-to-Many** (User to Posts) and **Many-to-One** (Post to User) relationships. This relationship allows each post to have one author, while each user can author multiple posts.

```ts
// posts.service.ts
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    // Find author from database based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);

    // Create post and associate author
    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
    });

    // Save post to the database
    return await this.postRepository.save(post);
  }

  public async findAll() {
    const posts = await this.postRepository.find({
      relations: {
        metaOptions: true,
        author: true,
      },
    });

    return posts;
  }
}
```

## The Foreign Key in One-to-Many

In relational databases like PostgreSQL, the **foreign key** is always on the **"many"** side of a relationship.

- In a **one-to-many** relationship between `User` and `Post`, the foreign key (`authorId`) is stored in the `Post` table, representing which user authored each post.
- The `User` table does **not** store information about related posts directly. Instead, TypeORM uses the foreign key in the `Post` table for mapping relationships.

When you query with `relations: ['posts']` (e.g., `userRepository.findOne({ where: { id: userId }, relations: ['posts'] })`), TypeORM internally creates SQL joins to fetch the posts for a user. This relationship is not visible as a column in the `User` table in database tools like PgAdmin, but TypeORM manages it through entity metadata.
