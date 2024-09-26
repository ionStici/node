# DTOs with Params and Mapped Types

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

## Mapped Types in NestJS

[Mapped Types](https://docs.nestjs.com/openapi/mapped-types)

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
