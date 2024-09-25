# Data Transfer Objects

## Introduction

While **built-in pipes** are useful for validating simple query parameters and route params, they are not ideal for validating complex request bodies with multiple properties, especially when dealing with larger objects, like in POST requests. Built-in pipes can make the controller code cluttered, and writing validation logic for complex data types (e.g., emails or passwords) becomes difficult.

### Key Points

- **Params and Queries:** For simple validation of params and queries (typically 2-5 key-value pairs), built-in pipes like `ParseIntPipe` and `DefaultValuePipe` are effective for transforming and validating values.
- **Request Bodies:** For larger objects (like user data with multiple properties), using pipes for validation becomes cumbersome and inefficient.
- **Need for DTOs:** A **DTO (Data Transfer Object)** is a class used to define and validate the structure of the incoming request body. With the help of **class-validator**, DTOs enable modular and clean validation of complex data.

### Benefits

- Centralized validation logic for properties such as email formats and password length/complexity.
- Keeps validation logic organized and out of the controller, making the codebase more modular.
- If validation fails, NestJS automatically throws an exception and returns it to the user.
