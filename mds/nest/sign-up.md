# Sign Up and Sign In Providers

## Table of Contents

- [Implementing User Creation Logic](#implementing-user-creation-logic)

## Implementing User Creation Logic

```ts
// users/providers/create-user.provider.ts
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { Repository } from "typeorm";
import { HashingProvider } from "src/auth/providers/hashing.provider";

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider // Injecting the Hashing Provider
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // Hash the user's password before saving to the database
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    return await this.usersRepository.save(newUser); // Save the user
  }
}
```

- **User Repository:** The `usersRepository` is injected using the `@InjectRepository` decorator.
- **Hashing the Password:** Before saving the user, we use `hashingProvider.hashPassword()` to securely hash the password.
- **Modular Approach:** Encapsulating the user creation logic into its own provider (`CreateUserProvider`) makes the code more maintainable and readable.
