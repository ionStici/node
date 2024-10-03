# Bidirectional Relationships

## Table of Contents

- [Bi-Directional One To One Relationship](#bi-directional-one-to-one-relationship)
- [Bidirectional One-to-One Relationships in Practice](#bidirectional-one-to-one-relationships-in-practice)
  - [Service Example: Using Bidirectional Relationship](#service-example-using-bidirectional-relationship)
  - [Summary](#summary)
- [onDelete Option](#ondelete-option)

## Bi-Directional One To One Relationship

A bidirectional relationship means that both entities in the relationship are aware of each other. In a database, this is achieved by defining references to each other in both entity files. In contrast to a unidirectional relationship, where only one entity knows about the relationship, a bidirectional relationship allows both entities to navigate the association.

For instance, consider a `User` and a `Profile` entity:

- In a **bidirectional relationship**, the `User` entity might reference the `Profile`, and the `Profile` entity might also reference the `User`. This means you can fetch the user's profile from the user entity and also find out which user a particular profile belongs to.

- The foreign key still resides in one of the tables, which is determined by where the `@JoinColumn` decorator is applied. If you want the foreign key to reside in the `Profile` table, you use `@JoinColumn` in the `Profile` entity.

- **Advantage:** A bidirectional relationship provides flexibility. You can retrieve the associated `Profile` while querying a `User` or vice versa. This is particularly useful if you need to navigate between entities from either direction. For example, you can easily fetch a `User`'s `Profile` or, starting from a `Profile`, you can determine which `User` it belongs to.

- **Cascade Operations:** In a bidirectional relationship, you can configure cascade operations such as deletion. This ensures that when a `User` is deleted, the related `Profile` is also deleted, which can prevent clutter or orphaned entries in your tables.

## Bidirectional One-to-One Relationships in Practice

In a bidirectional one-to-one relationship, both related entities are aware of their connection to each other. This enables greater flexibility in querying and operations.

_User Entity:_

```ts
import { Profile } from "./profile.entity";

@Entity()
export class User {
  // ... other columns

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  profile: Profile;
}
```

_Profile Entity:_

```ts
import { User } from "./user.entity";

@Entity()
export class Profile {
  // ... other columns

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
```

_Key Points:_

1. **Entity Definitions:**
   - In the `User` entity, the `profile` property represents a one-to-one relationship with the `Profile` entity.
   - The `@OneToOne` decorator is used for defining this relationship. The second parameter `(profile) => profile.user` specifies the inverse side of the relationship.
   - The `@JoinColumn()` decorator is used to indicate that the foreign key for this relationship will reside in the `User` table.
2. **Bidirectional Relationship:**
   - In the `Profile` entity, the `user` property establishes the reverse side of the relationship.
   - The `@OneToOne(() => User, (user) => user.profile)` decorator in `Profile` provides a link back to the `User` entity. This completes the bidirectional relationship.
   - With this setup, both entities (`User` and `Profile`) are aware of each other.
3. **Foreign Key:**
   - The foreign key is stored in the `User` table, as indicated by the `@JoinColumn()` decorator. This means that a column named `profileId` is created in the `User` table to reference the corresponding `Profile` entity.
4. **Cascading and Eager Loading:**
   - The `{ cascade: true, eager: true }` options in the `@OneToOne` decorator for `User` means:
   - **Cascade:** When a `User` is created or deleted, the corresponding `Profile` is automatically created or deleted as well.
   - **Eager Loading:** When a `User` is queried, the associated `Profile` is loaded automatically, without the need for specifying relations in the query.

### Service Example: Using Bidirectional Relationship

```ts
// user.service.ts
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>
  ) {}

  public async createUserWithProfile(
    userDto: createUserDto,
    profileDto: CreateProfileDto
  ) {
    const profile = this.profileRepository.create(profileDto);
    const user = this.userRepository.create(userDto);

    return await this.userRepository.save(user);
  }

  public async findUserProfile(userId: number) {
    // Fetch the User along with its Profile using UserRepository
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user?.profile;
  }

  public async findProfileUser(profileId: number) {
    // Fetch the Profile along with its User using ProfileRepository
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ["user"],
    });
    return profile?.user;
  }
}
```

_Creating User and Profile:_

- When creating a new `User`, we create a `Profile` and then assign it to the `user` object.
- Since the `cascade` option is enabled, saving the `User` will automatically save the `Profile`, making the process easier and reducing redundant code.

_Bidirectional Queries:_

- In the `findUserProfile` method, we use the `UserRepository` to fetch the `User` along with the associated `Profile`. This is simple because the `User` entity has eager loading enabled.
- In the `findProfileUser` method, we use the `ProfileRepository` to fetch a `Profile` and load its associated `User`. Here, we specify the relation explicitly using `{ relations: ["user"] }`.

### Summary

- **Bidirectional relationships** allow data to be accessed from either side of the relationship, increasing flexibility.
- **Foreign key** placement is determined by the `@JoinColumn()` decorator, which indicates where the relationship column should be stored.
- **Cascading** enables automatic operations, such as creating or deleting related entities, simplifying database interactions.
- **Eager loading** can be useful when frequently querying related data but should be used carefully to avoid performance issues due to unnecessary data retrieval.

## onDelete Option

The `{ onDelete: 'CASCADE' }` option automatically deletes related records when a referenced record is deleted, maintaining referential integrity.

```ts
// user.entity.ts
@OneToMany(() => Order, (order) => order.user, { onDelete: 'CASCADE' })
orders: Order[];
```

- **Purpose:** When a `User` is deleted, all related `Order` records are also deleted automatically.
- **Use Case:** Ensures no orphaned records remain when deleting a parent entity and simplifies cleanup.
- **Consideration:** Be cautious of unintended data loss. Suitable when child records have no meaning without the parent.
