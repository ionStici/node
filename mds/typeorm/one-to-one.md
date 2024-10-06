# One-to-One (1:1) Relationship

## Table of Contents

- [Creating a One-to-One Relationship](#creating-a-one-to-one-relationship)
- [Operating with Relationships Through Repositories](#operating-with-relationships-through-repositories)
  - [Creating Records with Relations Manually](#creating-records-with-relations-manually)
  - [Creating Records with Relations using Cascade](#creating-records-with-relations-using-cascade)
  - [Query with Relations](#query-with-relations)
  - [Eager Loading](#eager-loading)
  - [Delete Record along with its Relation](#delete-record-along-with-its-relation)
  - [Delete Record and Relations using onDelete Option](#delete-record-and-relations-using-ondelete-option)
- [Bidirectional One-to-One Relationship](#bidirectional-one-to-one-relationship)
  - [Querying in a Bidirectional (1:1) Relationship from Both Sides](#querying-in-a-bidirectional-11-relationship-from-both-sides)

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

## Operating with Relationships Through Repositories

### Creating Records with Relations Manually

```ts
// users.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { Profile } from "./profile.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) {}

  async createUserWithProfile(
    userData: Partial<User>,
    profileData: Partial<Profile>
  ) {
    // 1. Create a new Profile instance
    const profile = this.profileRepository.create(profileData);

    // 2. Save the profile to the database
    await this.profileRepository.save(profile);

    // 3. Create a new User instance and assign the saved Profile
    const user = this.userRepository.create({
      ...userData,
      profile: profile ? profile : null,
    });

    // 4. Save the user to the database
    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }
}
```

- The `User` entity will contain the `profileId` foreign key.

- Since `cascade` is not enabled, the `Profile` entity must be (1) created and (2) saved before it is (3) associated with the `User` entity.

### Creating Records with Relations using Cascade

`{ cascade: true }` : Automatically saves related entities.

```ts
@Entity()
export class User {
  @JoinColumn()
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;
}
```

When a `User` entity is saved, it will automatically create, save and assign the related `Profile` entity.

```ts
@Injectable()
export class UsersService {
  async createUserWithProfile(
    userData: Partial<User>,
    profileData: Partial<Profile>
  ) {
    const newUser = this.userRepository.create({ ...userData, profileData });
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }
}
```

`this.userRepository.save(newUser)` at this step, TypeORM first will save the `Profile` entity and assign the `profileId` foreign key to the `User` entity, then will save the `User` entity as well.

### Query with Relations

```ts
const user = await this.userRepository.find({
  where: { id: 1 },
  relations: ["profile", "post"],
  // relations: { profile: true, post: true },
});
```

`relations` : Specifies which related entities to load.

### Eager Loading

When querying a record with **eager loading** enabled, any assigned relations will be automatically included.

```ts
@Entity()
export class User {
  @JoinColumn()
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  profile: Profile;
}
```

`{ eager: true }` : Automatically load relations.

```ts
// Includes relations by default due to eager loading
const user = await this.userRepository.find({ where: { id: 1 } });
```

### Delete Record along with its Relation

```ts
@Injectable()
export class UsersService {
  async delete(id: number) {
    const user = await this.userRepository.find({
      where: { id },
      relations: ["profile"],
    });

    await this.userRepository.delete({ id });
    await this.profileRepository.delete({ id: user[0].profile.id });
  }
}
```

The `User` and `Profile` entries are deleted individually.

### Delete Record and Relations using onDelete Option

```ts
@Entity()
export class User {
  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: "CASCADE" })
  profile: Profile;
}
```

The `{ onDelete: 'CASCADE' }` option automatically deletes related records when a referenced record is deleted, maintaining referential integrity.

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
