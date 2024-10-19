# Hash Provider using Bcrypt

## Install Bcrypt

```bash
npm i bcrypt
```

## Create the Hashing Provider

Implement **password hashing and comparison** using the **Bcrypt** library.

```ts
// src/auth/providers/hashing.provider.ts
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashingProvider {
  // Hash the password
  public async hashPassword(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(); // Generate the salt
    return bcrypt.hash(data, salt); // Hash password with salt
  }

  // Compare the password with the hash
  public async comparePassword(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
```

- **Generating a Salt:** The `bcrypt.genSalt()` method creates a random salt that is added to the password before hashing. The salt ensures that even if two users have the same password, their hashes will be different.

- **Hashing the Password:** The `bcrypt.hash()` method takes the plain password and the generated salt, combining them to produce a unique hash.

- **Password Comparison:** The `bcrypt.compare()` method compares a plain-text password with a hashed password. If they match, it returns `true`, otherwise `false`.

- **Bcrypt:** Bcrypt provides built-in salt generation and hash comparison, reducing complexity and improving security.

## Create User Provider

```ts
import { HashingProvider } from "src/auth/providers/hashing.provider";

// users/providers/create-user.provider.ts
@Injectable()
export class CreateUserProvider {
  constructor(private readonly hashingProvider: HashingProvider) {}

  public async createUser(createUserDto: CreateUserDto) {
    // ...

    const newUser = this.usersRepository.create({
      ...createUserDto,
      // Hash the user's password before saving to the database
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    // ...
  }
}
```

**Hashing the Password:** Before saving the user, we use `hashingProvider.hashPassword()` to securely hash the password.

## Sign In Provider

```ts
// auth/providers/sign-in-provider.ts
import { HashingProvider } from "./hashing.provider";

@Injectable()
export class SignInProvider {
  constructor(private readonly hashingProvider: HashingProvider) {}

  public async signIn(signInDto: SignInDto) {
    // Find existing user by email
    const user = await this.usersService.findOneByEmail(signInDto.email);

    // Compare the input password to the hash
    const isPasswordEqual = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password
    );

    if (!isPasswordEqual) {
      throw new UnauthorizedException("Incorrect Password");
    }

    // Return JWT
    return "JWT";
  }
}
```
