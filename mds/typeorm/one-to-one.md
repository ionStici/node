# One-to-One (1:1) Relationship

## Creating a One-to-One Relationship

```ts
import { Entity, OneToOne } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class User {
  @JoinColumn()
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
```

```ts
import { Entity, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Profile {
  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
```

**`@OneToOne()`** : Creates a one-to-one (1:1) relationship.

- **First Argument:** `() => RelatedEntity` - Specifies the target entity that this entity is related to.
- **Second Argument:** `(relatedEntity) => relatedEntity.property` - Defines the property on the related entity that references back to this entity (inverse side).
- **Example:** `Profile` entity has a `user` property that points back to `User` entity.

**`@JoinColumn()`** : The entity with this decorator will contain the **foreign key** column.

- **Placement:** Placed on **one side only**, specifically on the **owning side** of the relationship.
- **Foreign Key Mapping:** `@JoinColumn()` tells TypeORM which table will have the foreign key column that establishes the relationship.
- **Example:** `@JoinColumn` is placed in the `User` entity, indicating that `User` is the owning side and will contain a `profileId` foreign key column referencing the `Profile` table.

## Bidirectional One-to-One Relationship

In a **bidirectional relationship** both entities are aware of each other. This means that you can query each entity from its related entity. The **foreign key** still resides in only one of the tables, which is determined by where the `@JoinColumn` decorator is applied.

```ts
@Entity()
export class Profile {
  @JoinColumn()
  @OneToOne(() => User, (user) => user.profile)
  user: User;
}

@Entity()
export class User {
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
```

For a relationship to be bidirectional, the `@OneToOne()` decorator must receive a second argument that sets the inverse side of the relationship for **BOTH entities**, specifying the property on the related entity that refers back to the current entity. This creates a two-way connection, allowing each entity to access the other through these properties.

### Querying in a Bidirectional (1:1) Relationship from Both Sides

```ts
// users.service.ts
@Injectable()
export class UsersService {
  async find(userId, profileId) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["profile"],
    });

    const profile = await this.postRepository.findOne({
      where: { id: profileId },
      relations: ["user"],
    });

    return { profile: user?.profile, user: profile?.user };
  }
}
```

This example demonstrates querying related entities from both sides of a bidirectional one-to-one relationship. By including the `relations` option in the `findOne` method, you eagerly load the associated entities, allowing direct access to `user.profile` and `profile.user` without additional queries.
