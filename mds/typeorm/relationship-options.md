# Relationship Options

- **`{ cascade: true }`** : Automatically apply operations such as insert to related entities.

- **`{ eager: true }`** : Automatically load the relation when the owning entity is loaded.

- **`{ onDelete: 'CASCADE' }`** : Automatically deletes associated entities.

- **`{ onUpdate: 'CASCADE' }`** : Automatically updates associated entities.

## Example

```ts
@OneToMany(() => Post, (post) => post.author, { cascade: true });
posts: Post[];
```

**Explanation:** Whe you save an `Author`, any new `Post` entities in `author.posts` will also be saved.
