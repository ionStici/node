# Repository Operations in (1:1) Relationships

## Table of Contents

- [Creating Records with Relations Manually](#creating-records-with-relations-manually)
- [Creating Records with Relations using Cascade](#creating-records-with-relations-using-cascade)
- [Query with Relations](#query-with-relations)
- [Eager Loading](#eager-loading)
- [Delete Record along with its Relation](#delete-record-along-with-its-relation)
- [Update Record](#update-record)

## Creating Records with Relations Manually

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

## Creating Records with Relations using Cascade

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

## Query with Relations

```ts
const user = await this.userRepository.find({
  where: { id: 1 },
  relations: ["profile", "post"],
  // relations: { profile: true, post: true },
});
```

`relations` : Specifies which related entities to load.

## Eager Loading

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

## Delete Record along with its Relation

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

## Update Record

```ts
@Injectable()
export class UsersService {
  async updateUser(patchUserDto: PatchUserDto) {
    const user = await this.userRepository.findOneBy({ id: patchUserDto.id });

    user.email = patchUserDto.email ?? user.email;
    user.name = patchUserDto.name ?? user.name;

    await this.userRepository.update({ id: patchUserDto.id }, { ...user });
  }
}
```
