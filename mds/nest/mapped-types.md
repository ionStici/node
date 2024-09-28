# DTOs with Params and Mapped Types

## Table of Contents

- [DTOs with Params](#dtos-with-params)
- [Mapped Types in NestJS](#mapped-types-in-nestjs)

## DTOs with Params

How to validate route parameters using a DTO (Data Transfer Object) and apply transformation and validation logic in a clean, modular way.

### DTO Definition

```ts
// users/dtos/get-users-param.dto.ts
import { IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class GetUsersParamDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
```

- **Validation:** The `@IsOptional()` and `@IsInt()` decorators from `class-validator` ensure that the `id` is optional and, if present, must be an integer.
- **Transformation:** The `@Type(() => Number)` decorator from `class-transform` ensures that the `id` is automatically converted from a string (as received in ULR params) to a number.

### Controller

```ts
// users/users.controller.ts
import { GetUsersParamDto } from "./dtos/get-users-param.dto";

@Controller("users")
export class UsersController {
  @Get("/:id?")
  public getUsers(@Param() getUsersParamDto: GetUsersParamDto) {}
}
```

- Built-in pipes like `ParseIntPipe` makes params required, which isn't always desired. By using a DTO, we can ensure that params remain optional and properly validated.

- **Global Validation:** Validation is applied globally in `main.ts`, so there’s no need to specify `ValidationPipe` in every controller. This simplifies the validation process for params, query strings, and bodies.

## Mapped Types in NestJS

[Mapped Types](https://docs.nestjs.com/openapi/mapped-types) - manage Data Transfer Objects (DTOs) efficiently by avoiding code repetition.

```bash
npm i @nestjs/mapped-types
```

### Code Example

```ts
// users/dtos/patch-user.dto.ts

import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class PatchUserDto extends PartialType(CreateUserDto) {}
```

- **Mapped Types:** Mapped types allow you to reuse DTO properties by inheriting and transforming them, reducing repetitive code. This is especially useful for partial updates, like in PATCH requests.

- The `PartialType` mapped type automatically makes the properties from an existing DTO (`CreateUserDto`) **optional**, maintaining the validation logic from the original DTO. This is ideal for PATCH requests, where only some fields need to be updated.

- **DRY Principle:** Instead of copying and pasting properties from one DTO to another (from `CreateUserDto` to `PatchUserDto`), using `PartialType` ensures that the code is reusable and adheres to the DRY principle.

### Controller

```ts
// users/users.controller.ts
import { Controller, Body, Patch } from "@nestjs/common";
import { PatchUserDto } from "./dtos/patch-user.dto";

@Controller("users")
export class UsersController {
  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
  }
}
```
