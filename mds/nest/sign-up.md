# Sign Up and Sign In Providers

## Table of Contents

- [Implementing User Creation Logic](#implementing-user-creation-logic)
- [Sign In Logic](#sign-in-logic)
  - [Custom Http Status Codes](#custom-http-status-codes)

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

## Sign In Logic

```ts
// auth/providers/sign-in.provider.ts
import { UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";
import { SignInDto } from "../dtos/signin.dto";
import { HashingProvider } from "./hashing.provider";

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(HashingProvider)
    private readonly hashingProvider: HashingProvider
  ) {}

  public async signIn(singInDto: SignInDto) {
    // Find the user using email
    const user = await this.usersService.findOneByEmail(signInDto.email);

    let isPasswordEqual: boolean = false;

    try {
      // Compare password to the hash
      isPasswordEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password
      );
    } catch (error) {
      // Throw exception if operation failed
      throw new RequestTimeoutException(error, {
        description: "Could not compare passwords",
      });
    }

    // Throw exception if passwords do not match
    if (!isPasswordEqual) {
      throw new UnauthorizedException("Incorrect Password");
    }

    // Send Confirmation
    return true;
  }
}
```

```makefile
POST http://localhost:3000/users
Content-Type: application/json
Authorization: Bearer <jwt-access-token>
```

### Custom Http Status Codes

```ts
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./providers/auth.service";
import { SignInDto } from "./dtos/signin.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  @HttpCode(HttpStatus.Ok)
  public signIn(@Body() singInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
```
