# Data Transfer Objects (DTOs) in NestJS

In NestJS, **Data Transfer Objects (DTO)** are used to define the structure of incoming request data and apply validation and transformation rules using decorators.

## Install Required Packages

```bash
# https://github.com/typestack/class-validator
npm i class-validator # validates properties

# https://github.com/typestack/class-transformer
npm i class-transformer # transforms incoming properties
```

## Creating a DTO

**DTO** is a class that defines the structure and validation rules for the incoming data.

**Purpose of DTO:** It acts as a validation schema that ensures only valid data reaches the controller.

```ts
// users/dtos/create-user.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
  IsEnum,
  IsJSON,
  IsUrl,
  IsISO8601,
  IsArray,
  ValidateNested,
} from "class-validator";

export class CreateUserDto {
  // ...

  @IsEmail()
  @IsNotEmpty({ message: "Email is Required" })
  email: string;
}
```

- Decorators from `class-transformer` enforces validation rules.
- Each validation decorator accepts an object with options where we can provide a custom message that will be used in case the validation fails.
- `@IsString()` ensures the property is a string.
- `@IsNotEmpty()` validates that the property is not empty (required).
- `@IsOptional()` makes the property as an optional field.
- `@MinLength(3)` & `@MaxLength(96)` : Specifies minimum and maximum string length.
- `@IsEmail()` checks if the value is a valid email address.
- `@Matches()` Validates according to the provided regex.

## More Decorators

- `@IsArray()`

- `@IsEnum(enum)` : For enums.

- `@IsJSON()` : For Json.

- `@IsUrl()` : For Url.

- `@IsISO8601()` : For ISO dates.

- `@ValidateNested({ each: true })` : Validation applies to nested elements inside the array.

## Nested DTOs with ValidateNested

```ts
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { Type } from "class-transformer";

export class CreateManyUsersDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
```

## Applying a DTO in the Controller

```ts
// users/users.controller.ts
import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";

@Controller("users")
export class UsersController {
  @Post()
  public createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    console.log(createUserDto);
  }
}
```

- `new ValidationPipe()` : Applies the validation rules defined in the DTO.
- `createUserDto: CreateUserDto` : The incoming request body is validated according to the validation rules in the DTO.

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

## Global Pipes and Avoiding Malicious Requests

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
