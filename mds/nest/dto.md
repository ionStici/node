# Data Transfer Objects (DTOs) in NestJS

## Introduction

In NestJS, a **Data Transfer Object (DTO)** is a class that defines the structure of incoming request data and applies validation and transformation rules using decorators.

**Purpose of a DTO:** It acts as a validation schema that ensures only valid data reaches the controller. If the data doesn't pass the validation rules (e.g. an invalid email), NestJS throws a Bad Request (400) error.

## Install Required Packages

```bash
# https://github.com/typestack/class-validator
npm i class-validator # validates properties

# https://github.com/typestack/class-transformer
npm i class-transformer # transforms incoming properties
```

## Creating a DTO

```ts
// users/dtos/create-user.dto.ts
import { IsEmail, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateUserDto {
  @IsEmail()
  @Transform((value) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

**Flow of a Request:** Before reaching the controller, the request body is validated against the DTO, and if each property is valid according to the decorators applied then it reaches the controller, otherwise NestJS throws a 400 Bad Request error. The controller then receives a validated and transformed data as an instance of the DTO.

## Applying a DTO in the Controller

```ts
// users/users.controller.ts
import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";

@Controller("users")
export class UsersController {
  @Post("create")
  createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    console.log(createUserDto); // { email: 'example@email.com', password: 'abcd1234' }
  }
}
```

- `new ValidationPipe()` : Applies the DTO.
- `createUserDto: CreateUserDto` : The incoming request body is validated and transformed based on the rules in the DTO.

### Global Pipes

```ts
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global validation pipe with options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strips extra properties
      forbidNonWhitelisted: true, // Throws an error for extra properties
      transform: true, // transform request body to DTO instance
    })
  );

  await app.listen(3000);
}

// With Global Pipes we don't apply `ValidationPipe` to the controller:
// @Post() public createUsers(@Body() createUserDto: CreateUserDto) {}
```

- **Global Validation Pipe:** Instead of manually adding `ValidationPipe` in every controller method, we can set it globally in `main.ts` with `app.useGlobalPipes()`. This ensures all API endpoints automatically validate incoming requests.

- `whitelist: true` : When enabled, NestJS automatically removes any properties from the request body that are NOT defined in the DTO.

- `forbidNonWhitelisted: true` : This option throws a Bad Request (400) error if the request body contains extra properties not defined in the DTO.

- `transform: true` : By default, the request body is received as a plain JS object (essentially a JSON object). However, when `transform` is enabled, NestJS will transform this object into an instance of the DTO class, allowing you to access method, properties, and types that exist on the DTO.

```ts
//  Converting to an Instance of DTO with 'transform: true' option
console.log(createUserDto instanceof CreateUserDto); // true
```
