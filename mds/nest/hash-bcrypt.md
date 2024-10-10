# Implementing Authentication

## Table of Contents

- [Install Bcrypt](#install-bcrypt)
- [Create the Hashing Provider](#create-the-hashing-provider)
  - [Abstract Hashing Provider](#abstract-hashing-provider)
  - [Concrete Implementation with Bcrypt](#concrete-implementation-with-bcrypt)
- [Register the Hashing Providers](#register-the-hashing-providers)

## Install Bcrypt

```bash
npm i bcrypt
```

## Create the Hashing Provider

Implement **password hashing and comparison** using the **Bcrypt** library.

### Abstract Hashing Provider

```ts
// auth/providers/hashing.provider.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class HashingProvider {
  // Hash passwords
  abstract hashPassword(data: string | Buffer): Promise<string>;

  // Compare provided password with the hashed one
  abstract comparePassword(
    data: string | Buffer,
    encrypted: string
  ): Promise<boolean>;
}
```

This abstract class allows us to switch hashing algorithms easily in the future without changing the entire application.

### Concrete Implementation with Bcrypt

```ts
// auth/providers/bcrypt.provider.ts
import { Injectable } from "@nestjs/common";
import { HashingProvider } from "./hashing.provider";
import * as bcrypt from "bcrypt";

@Injectable()
export class BcryptProvider implements HashingProvider {
  // Hash the password
  public async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt(); // Generate a salt
    return bcrypt.hash(data, salt); // Hash password with salt
  }

  // Compare the password with the stored hash
  public comparePassword(
    data: string | Buffer,
    encrypted: string
  ): Promise<boolean> {
    return bcrypt.compare(data, encrypted); // Compare hashed password with stored hash
  }
}
```

_Generating a Salt:_

- The `bcrypt.genSalt()` method creates a random salt that is added to the password before hashing.
- The salt ensures that even if two users have the same password, their hashes will be different.

_Hashing the Password:_

- The `bcrypt.hash()` method takes the plain password and the generated salt, combining them to produce a unique hash.

_Password Comparison:_

- The `bcrypt.compare()` method compares a plain-text password with a hashed password. If they match, it returns `true`, otherwise `false`.

_Why Use This Approach?_

- **Modularity:** By using an abstract class (`HashingProvider`) and concrete implementation (`BcryptProvider`), we can easily swap out the hashing algorithm in the future without changing the overall structure.
- **Bcrypt's Strength:** Bcrypt provides built-in salt generation and hash comparison, reducing complexity and improving security.

## Register the Hashing Providers

Map the abstract `HashingProvider` to the concrete implementation of `BcryptProvider` using NestJS's dependency injection.

```ts
// auth/auth.module.ts
import { BcryptProvider } from "./providers/bcrypt.provider";
import { HashingProvider } from "./providers/hashing.provider";

@Module({
  providers: [
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
})
export class AuthModule {}
```

- **Abstract and Concrete Classes:** `HashingProvider` is an abstract class, while `BcryptProvider` implements the logic for password hashing and comparison.
- **Dynamic Swapping:** If you ever want to replace Bcrypt with another algorithm (e.g., Argon2), you only need to change the `useClass` to a new provider that implements the `HashingProvider`.
