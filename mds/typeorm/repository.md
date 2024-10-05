# Repository

## Table of Contents

- [What is a Repository](#what-is-a-repository)
- [Injecting a Repository into a Service](#injecting-a-repository-into-a-service)
  - [Registering the Entity](#registering-the-entity)
  - [Repository Injection](#repository-injection)

## What is a Repository

**A Repository** in TypeORM is an abstraction layer used to **interact** with a specific **entity** from the database.

It encapsulates all the logic required to access data sources, providing a set of methods to perform CRUD (Create, Read, Update, Delete) operations without the need to write raw SQL queries.

- **Purpose:** Simplify database interactions by providing an abstracted interface.
- **Entity-Specific:** Each repository is tied to an entity class (e.g., `User`, `Post`).

## Injecting a Repository into a Service

### Registering the Entity

TypeORM **injects** repositories into services using dependency injection.

```ts
// users.module.ts
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
})
export class UsersModule {}
```

`TypeOrmModule.forFeature([Users])` : Registers the `Users` entity, making its repository available for injection.

### Repository Injection

```ts
// users.service.ts
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    // Injecting User Repository
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>
  ) {}

  async findUserById(id: number): Promise<Users> {
    return await this.usersRepository.findOneBy({ id });
  }
}
```

- `@InjectRepository(Users)` : Injects the repository for the `Users` entity.
- `Repository<Users>` : Provides methods to interact with the `Users` entity through the `usersRepository` interface.
- `usersRepository.findOneBy` : Query a single record
