# Mapped Types

[**Mapped Types**](https://docs.nestjs.com/openapi/mapped-types) for efficiently managing DTOs.

```bash
npm i @nestjs/mapped-types
```

## `PartialType`

```ts
// users/dtos/patch-user.dto.ts

import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class PatchUserDto extends PartialType(CreateUserDto) {}
```

- `PartialType` converts all properties of the DTO to be optional.
- **Use case:** When creating an update DTO where all fields are optional.

## `IntersectionType`

```ts
import { IntersectionType } from "@nestjs/mapped-types";
import { UserDetailsDto, UserCredentialsDto } from "./dtos/all.dto";

export class UserDto extends IntersectionType(UserDetailsDto, UserCredentialsDto) {}
```

- `IntersectionType` : Combines two or more DTOs into one new DTO that includes all properties of the original DTOs.
- **Use case:** When you need to merge multiple DTOs into one, combining the attributes.

## `OverwriteType`

```ts
import { OverwriteType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./dtos/create-user.dto";

class AdminUserDto extends OverwriteType(CreateUserDto, { age: string }) {}
```

- Allows you to overwrite properties in the base DTO with new types.
- **Use case:** When you want to change the type of one or more properties in the extended DTO.

## `PickType`

```ts
import { PickType } from "@nestjs/mapped-types";

class LoginUserDto extends PickType(CreateUserDto, ["username", "password"] as const) {}
```

- Creates a new DTO class by picking (selecting) a subset of properties from an existing DTO.
- **Use case:** When you only need a few specific fields from a DTO for a particular operation.

## `OmitType`

```ts
import { OmitType } from "@nestjs/mapped-types";

class UpdateUserDto extends OmitType(CreateUserDto, ["password"] as const) {}
```

- Creates a new DTO class by omitting (excluding) specified properties from an existing DTO.
- **Use case:** When you need most of the fields from a DTO but want to exclude a few.
