# Entity

## Table of Contents

- [Introduction](#introduction)
- [Creating the User Entity](#creating-the-user-entity)
  - [Adding the User Entity to TypeORM Configuration](#adding-the-user-entity-to-typeorm-configuration)
  - [Key Considerations](#key-considerations)
  - [Best Practice - Keep DTO and Entity in Sync](#best-practice---keep-dto-and-entity-in-sync)
- [Creating the Repository](#creating-the-repository)
  - [User Service with Repository Injection](#user-service-with-repository-injection)
  - [Module Setup](#module-setup)
  - [User Controller](#user-controller)
  - [Making a POST request using httpYac](#making-a-post-request-using-httpyac)
  - [Key Concepts](#key-concepts)
  - [Summary](#summary)
- [More Decorators and Configuration Options](#more-decorators-and-configuration-options)

## Introduction

An **entity** is a **representation of a database table**. In TypeORM, entities are TypeScript classes with decorators that define table columns and properties.

## Creating the User Entity

The following code defines a `User` entity, representing the `users` table with fields like `firstName`, `lastName`, `email`, `password`, and `id`.

```ts
// users/user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() // Marks the class as a database table
export class User {
  @PrimaryGeneratedColumn() // Defines an auto-generated primary key
  id: number;

  @Column({
    // Represents a column for the first name in the database
    type: "varchar", // Specifies the column type as variable character string
    length: 96, // Maximum length of 96 characters
    nullable: false, // Column cannot be null
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 96,
    nullable: true, // Optional column
  })
  lastName: string;

  @Column({
    type: "varchar",
    length: 96,
    nullable: false,
    unique: true, // Email must be unique in the table
  })
  email: string;

  @Column({
    type: "varchar",
    length: 96,
    nullable: false,
  })
  password: string;
}
```

_Explanation of Decorators:_

- `@Entity()` : Marks the class as an **entity**, meaning it represents a database table.
- `@PrimaryGeneratedColumn()` : Defines the **primary key** for the table. The ID is **auto-generated** by the database.
- `@Column()` : Represents a **regular column** in the table. Properties marked with `@Column()` become columns in the `users` table.

_Column Configurations:_

- `@Column()` : Used to define **columns** in the database table.
- Columns in an entity can be customized by passing a **configuration object** to the `@Column({})` decorator. This allows us to define important attributes such as column type, maximum length, nullability, and more.
- `type` : Defines the column type (e.g., '`varchar`' for strings).
- `length` : Limits the number of characters allowed in the column.
- `nullable` : Specifies whether the column can have a `null` value.
- `unique` : Ensures that the value is unique across all rows in the table.
- `default` : Sets a default value.

_Resources:_

- [Doc: Available Column Options](https://typeorm.io/entities#column-options)
- [Doc: Column types for `postgres`](https://typeorm.io/entities#column-types-for-postgres)

### Adding the User Entity to TypeORM Configuration

To let **TypeORM** know about the `User` entity, add it to the `entities` array in the **TypeORM configuration**.

```ts
// app.module.ts
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity"; // Import the User entity

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        entities: [User], // Registering the User entity
        synchronize: true, // Automatically sync the schema with the database (use only in dev)
      }),
    }),
  ],
})
export class AppModule {}
```

### Key Considerations

1. **Column Types:**
   - Different databases have different supported column types. For example, PostgreSQL and MySQL may share common types like `varchar`, but there can also be database-specific types.
   - When defining column types, try to choose **common column types** if you plan to switch between databases, but it's not always possible.
2. **Synchronization Between DTO and Entity:**
   - Ensure that the **entity** and the corresponding **DTO** match in terms of field properties, such as maximum length and optional fields.
   - In the example above, `firstName`, `lastName`, `email`, and `password` must have the same constraints in both the **DTO** and **entity** to avoid discrepancies.
3. **Column Constraints:**
   - **Nullable Fields:** Fields like `lastName` are marked as `nullable: true`, which means they are optional.
   - **Unique Fields:** The `email` field is marked as `unique: true`, meaning no two users can share the same email address in the database.

### Best Practice - Keep DTO and Entity in Sync

When creating entities and DTOs, ensure that properties like **maximum length** and **nullability** are consistent between them. For instance:

- If `firstName` has a **maximum length of 96** characters in the entity, the **DTO** should validate this as well to avoid discrepancies.

This consistency prevents errors where valid DTO data is rejected at the database level.

## Creating the Repository

How to create a **User repository** using **TypeORM** and integrate it with our **UserService** to perform database operations.

### User Service with Repository Injection

**Repository Injection in Service:** A repository in TypeORM is a layer used for interacting with the database, specifically for an entity like `User`. Repositories are injected into services to perform operations like creating or finding users.

```ts
// users/providers/users.service.ts
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Injecting User Repository
    private usersRepository: Repository<User>
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // Check if user exists with the same email
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    // Handle exception

    // Create a new user
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }
}
```

_Injecting the Repository:_

- We use `@InjectRepository(User)` to inject the **User repository**.
- The `usersRepository` is of type `Repository<User>`, allowing us to interact with the `User` entity.

_Create User Method:_

- `findOne`: Searches the database to check if a user with the provided email already exists.
- `create`: Creates a new user instance without persisting it to the database.
- `save`: Saves the user instance to the database.

_await:_

- Only when saving a row into the database you need to use the `await` keyword because it returns a promise, when creating an entry using `create` you don't need the `await` keyword.

### Module Setup

```ts
// users/users.module.ts
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Importing User entity into the module
})
export class UsersModule {}
```

`TypeOrmModule.forFeature([User])` : This method is used to make the **User entity** repository available within the UsersModule. This step is crucial to allow dependency injection of the repository into the service.

### User Controller

```ts
// users/users.controller.ts
import { UsersService } from "./providers/users.service";
import { CreateUserDto } from "./dtos/create-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
```

_`createUsers` Method:_

- `@Post()` : Maps to a `POST` request to the `/users` route.
- `@Body()` : Captures the request body and passes it to the `createUserDto` parameter.
- Uses the `UsersService` to create a new user with the given data.

### Making a POST request using httpYac

```bash
# POST request
POST http://localhost:3000/users
Content-Type: application/json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@doe.com",
  "password": "password123!"
}

```

### Key Concepts

1. **Entity Synchronization:**
   - TypeORM automatically **synchronizes** entities with your database when `synchronize` is set to `true` in your configuration. This is useful for development but not recommended in production.
2. **Repository Pattern:**
   - The **Repository pattern** provides easy-to-use methods to perform CRUD operations on entities.
   - Examples: `findOne` finds a single record, `create` creates an instance of the entity, `save` persists the instance to the database.
3. **Dependency Injection:**
   - Repositories are injected into services to enable separation of concerns and make the service layer responsible for business logic, keeping database operations clean and reusable.

### Summary

- **Repository Setup:** We injected the **User repository** into `UsersService` using the `@InjectRepository` decorator.
- **CRUD Operations:** We used the repository to create and save a user in the database.
- **DTO and Entity Synchronization:** Ensured that the **DTO** and **entity** definitions align to avoid discrepancies during validation and persistence.

## More Decorators and Configuration Options

[Decorator Reference](https://orkhan.gitbook.io/typeorm/docs/decorator-reference)

```ts
import { CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class Item {
  @CreateDateColumn()
  createData: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

- **CreateDateColumn:** Automatically sets and saves the date when an entity is first created. Used for tracking when an entity was added to the database.
- **UpdateDateColumn:** Automatically updates with the current timestamp whenever the entity is updated. Useful for tracking changes and modifications over time.
- **DeleteDateColumn:** Used to implement soft deletes by recording the date an entity is "deleted." This allows the entity to be flagged as deleted without permanently removing it from the database, enabling recovery if needed.
