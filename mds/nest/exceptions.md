# Exception Handling

## Introduction

**Exceptions** are errors detected during execution that can disrupt the flow of the application. Examples are invalid input, unauthorized access, missing resources, or internal server errors. Handling these errors ensures stability and proper user feedback.

NestJS uses a default **exceptions layer** to manage unhandled errors and return appropriate HTTP responses, such as: 500 Internal Server Error, 400 Bad Request, 404 Not Found, 401 Unauthorized, 403 Forbidden.

NestJS provides [**built-in exception classes**](https://docs.nestjs.com/exception-filters#built-in-http-exceptions) to handle common HTTP errors, examples: `BadRequestException`, `UnauthorizedException`, `NotFoundException`, and many more.

```ts
throw new NotFoundException("Resource not found");
```

Exceptions should be managed in **services**, not controllers, keeping the business logic clear.

**Key areas for exception handling:** Database operations, Model constraints, External API Interactions, Middleware.

## Exception Handling Model Constraints

1. **Handling Database Connectivity Issues:**

   - Any interaction with a database (e.g., fetching, creating, updating, deleting) is prone to errors, especially if there are connection issues.
   - In the `catch` block, we throw a `RequestTimeoutException` to handle scenarios where the database is unreachable, signaling to the client that the request could not be processed.

2. **Model Constraint Handling (Unique Email):**

   - Before creating a new user, we check whether a user with the same email already exists. If the email is found, we throw a `BadRequestException` to indicate that the email is not valid because it’s already in use.

3. **Graceful Error Handling:**

   - Exception handling ensures that we provide meaningful, user-friendly error messages. For example, instead of sending a generic `500 Internal Server Error` when a duplicate email is detected, we inform the user with a `400 Bad Request` and a clear message explaining the issue.

4. **Logging Errors (Optional):**

   - In production, you might want to log these errors to a database or file for future debugging. This can be done inside the `catch` block, where you can record detailed error information.

```ts
import { BadRequestException, RequestTimeoutException } from "@nestjs/common";

@Injectable()
export class UsersService {
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    try {
      // Check if user exists with the same email
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      // Handle database connectivity issue
      throw new RequestTimeoutException(
        "Unable to process your request at the moment, please try later",
        { description: "Error connecting to the database" }
      );
    }

    // If user already exists, throw a BadRequestException
    if (existingUser) {
      throw new BadRequestException("The user already exists, please check your email.");
    }

    // Create a new user
    let newUser = this.usersRepository.create(createUserDto);

    try {
      // Save the new user to the database
      await this.usersRepository.save(newUser);
    } catch (error) {
      // Throw exception if saving the user to database failed
      throw new RequestTimeoutException(
        "Unable to process your request at the moment, please try later",
        { description: "Error connecting to the database" }
      );
    }

    return newUser;
  }
}
```
