# Data Transfer Objects (DTOs) in NestJS

## Table of Contents

- [Introduction](#introduction)
  - [Key Points](#key-points)
  - [Benefits of DTOs](#benefits-of-dtos)
- [Creating a DTO (Data Transfer Objects)](#creating-a-dto-data-transfer-objects)
  - [Installing Required Packages](#installing-required-packages)
  - [DTO Examples: `CreateUserDTO`](#dto-examples-createuserdto)
  - [Applying DTO in the Controller](#applying-dto-in-the-controller)
  - [Key Concepts](#key-concepts)
  - [Example Flow of a Validated Request](#example-flow-of-a-validated-request)
- [Global Pipes and Avoiding Malicious Requests](#global-pipes-and-avoiding-malicious-requests)
  - [Benefits of `transform: true`](#benefits-of-transform-true)

## Introduction

While **built-in pipes** are useful for validating simple query and route parameters, they are not ideal for validating complex request bodies in POST requests.

A **DTO (Data Transfer Object)** is a simple object used to transfer data between layers or services within an application. In NestJS, DTOs are typically used to define the structure of incoming request data and apply validation rules using decorators.

### Key Points

- **Params and Queries:** Built-in pipes like `ParseIntPipe` and `DefaultValuePipe` are sufficient for simple param and query validation (2-5 key-value pairs).
- **Complex Request Bodies:** For larger objects, such as user data in POST requests, pipes alone are inefficient for validation.
- **DTOs:** A **DTO (Data Transfer Object)** is a class used to define and validate the structure of the request body. **class-validator** decorators simplify this process.

### Benefits of DTOs

- Centralized validation logic for properties such as email formats and password length/complexity.
- Keeps validation logic organized and out of the controller, making the codebase more modular.
- If validation fails, NestJS throws an exception, returning helpful error messages to the client.

## Creating a DTO (Data Transfer Objects)

How to implement DTOs (Data Transfer Objects) and validate incoming request data using **class-validator** and **class-transformer** in NestJS.

### Installing Required Packages

```bash
# https://github.com/typestack/class-validator
npm i class-validator

# https://github.com/typestack/class-transformer
npm i class-transformer
```

- `class-validator`: Provides decorators for validating the properties of your DTOs. It allows easy validation of incoming request data, such as strings, numbers, and more complex formats like email.
- `class-transformer`: Transforms the incoming plain JSON object into an instance of the DTO class. It works alongside `class-validator` to ensure data types and validation rules are enforced properly.

### DTO Examples: `CreateUserDTO`

The **DTO** is a class that defines the structure and validation rules for the incoming data.

```ts
// users/dtos/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(96)
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: "Minimum eight characters, at least one letter, one number and one special character",
  })
  password: string;
}
```

- **Decorators from `class-validator`:** Each property in the DTO id decorated with specific validation rules.

- `@IsString()` : Ensures the property is a string.

- `@IsNotEmpty()` : Validates that the property is not empty (required).

- `@MinLength(3)` / `@MaxLength(96)` : Specifies minimum and maximum string length.

- `@IsEmail()` : Validates that the value is a valid email address.

- `@Matches` : Validates according to the provided regex.

- `@IsOptional()` : Marks a property as an optional field.

- **Message:** The second argument of a validation decorator is a custom message that will be used in case the validation failed.

- **Purpose of DTO:** It acts as a validation schema that ensures only valid data reaches your controllers and services.

### Applying DTO in the Controller

```ts
// users/users.controller.ts
import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";

@Controller("users")
export class UsersController {
  @Post()
  public createUsers(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    console.log(createUserDto);
  }
}
```

- The `@Body()` decorator extracts the incoming request body.

- `new ValidationPipe()` applies the validation rules defined in the DTO. `ValidationPipe` uses the `class-validator` decorators in the DTO to validate the request automatically.

- `createUserDto: CreateUserDto` : The incoming request body is validated according the the validation rules from the DTO.

### Key Concepts

1. **Validation Logic in DTOs:**

   - DTOs encapsulates validation rules within a class.
   - Properties are validated based on rules specified by the decorators.

2. **Automatic Validation:**

   - The `ValidationPipe` automatically validates the incoming request data against the DTO. If the data doesn't pass the validation rules (e.g. an invalid email), NestJS returns a **Bad Request (400)** error.

3. **Modular and Reusable Code:**

   - By separating validation into DTOs, you keep the controller clean and modular. You can reuse the same DTO across multiple controller if needed.

### Example Flow of a Validated Request

1. **Client Request**

   - A client sends a POST request to `/users` with the following body:

   ```json
   {
     "name": "John",
     "email": "john@example.com",
     "password": "Password123!"
   }
   ```

2. **Validation**

   - The `ValidationPipe` checks each field in the request body based on the `CreateUserDto` class. If all validation rules are satisfied, the request proceeds.
   - If validation failed (e.g., the email is invalid), NestJS automatically returns a 400 Bad Request error with details about the failed validation.

3. **Controller Action**

   - The `createUsers()` method receives the validated and transformed data as an instance of `CreateUserDto`.
   - The controller processes the data or passes it to the service layer for further operations, like saving the user to a database.

## Global Pipes and Avoiding Malicious Requests

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

1. **Global Validation Pipe** : Instead of manually adding `ValidationPipe` in every controller method, we set it globally in `main.ts` with `app.useGlobalPipes()`. This ensures all API endpoints automatically validate incoming requests.

2. `whitelist: true` : When enabled, NestJS automatically removes any properties from the request body that are NOT defined in the DTO. This ensures only the properties listed in the DTO are processed, preventing unwanted data from reaching the controller.

3. `forbidNonWhitelisted: true` : This option throws a **Bad Request (400)** error if the request body contains extra properties not defined in the DTO. It increases security by rejecting any unexpected data, helping to prevent malicious clients from sending unauthorized fields.

4. `transform: true` : By default, the request body is received as a plain JavaScript object (essentially a JSON object). However, when `transform` is enabled, NestJS will transform this object into an instance of the DTO class, allowing you to access methods, properties, and types that exist on the DTO.

```ts
//  Converting to an Instance of DTO with 'transform: true' option
console.log(createUserDto instanceof CreateUserDto); // true
```

### Benefits of `transform: true`

- **Type-Safe Requests**: Enforces type safety across your app, as request data is automatically transformed into the expected types defined in your DTOs.
- **Cleaner Controllers**: You don’t need to manually convert data in your controllers; NestJS automatically handles the transformation.
- **OOP Features**: When a request body is transformed into an instance of a class, you can access class methods, inheritance, and more.
