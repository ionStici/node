# Relationship Options

### 1. `cascade`

- **Purpose:** Automatically apply operators to related entities.

- **Type:** `boolean` or `("insert" | "update" | "remove" | "soft-remove" | "recover")[]`

- `cascade: true` is equivalent to `cascade: ["insert", "update"]`. Default is `false`.

```ts
@OneToMany(() => Post, (post) => post.author, { cascade: true })
posts: Post[];
```
