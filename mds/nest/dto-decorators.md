# Essential Decorators Used in DTOs

## Class Validator Decorators

Decorators from `class-validator` enforces validation rules. Each validation decorator accepts an object with options where we can provide a custom message that will be used in case the validation fails.

- `@IsString()` : Validates that the property is a string.

- `@IsNumber()` : Ensures the value is a number.

- `@IsBoolean()` : Checks if a value is a boolean.

- `@IsEmail()` : Checks if the value is a valid email address.

- `@IsOptional()` : Marks a field as optional.

- `@IsNotEmpty()` validates that the property is not empty (required).

- `@MinLength(3)` & `@MaxLength(96)` : Specifies minimum and maximum string length.

- `@Min(1)` & `@Max(10)` : Validates that a number is within the range (greater or less).

- `@IsInt()` : Validates that the property is an integer.

- `@IsArray()` : Checks if the value is an array.

- `@ValidateNested({ each: true })` : Validation applies to nested elements inside the array.

- `@ValidateIf(condition)` : Allows conditional validation.

- `@Matches(regex)` Validates according to the provided regex.

- `@IsEnum(enum)` : For enums.

- `@IsJSON()` : For JSON.

- `@IsUrl()` : For URLs.

- `@IsISO8601()` : For ISO dates.

## Class Transformer Decorators

### `@Type(() => Type)`

Converts the value to the specified type class during transformation.

```ts
@IsArray()
@ValidateNested({ each: true })
@Type(() => Post)
posts: Post[];
```

### `@Transform(transformFn, options?)`

Applies a custom transformation to the value when the object is serialized or deserialized.

```ts
@Transform(({ value }) => value.trim())
name: string;
```
