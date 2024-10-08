# Throw a Custom Exception in NestJS

```ts
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  public findAll() {
    // Throwing a custom exception
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY, // Status code 301
        error: "The API endpoint does not exist",
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: "Occurred because the API endpoint was permanently moved.",
      }
    );
  }
}
```

### 1. HttpException Class

`HttpException` is a generic class in NestJS that allows you to throw custom exceptions. It takes up to three arguments:

1. **Response Object:** This contains details like the status and error message that will be sent to the client.
2. **HTTP Status Code:** You can pass an appropriate status code (e.g., 404 for Not Found, 500 for Internal Server Error).
3. **Options Object (optional):** Contains additional details that are not sent to the client but can be used for logging or debugging.

### 2. Response Object

In the first argument, we define the response:

- `status` : We use `HttpStatus.MOVED_PERMANENTLY` (301) to indicate that the endpoint has been moved.
- `error` : A custom message to inform the client that the API endpoint is no longer available.

### 3. HTTP Status

- We use `HttpStatus` to provide a clear and readable way of defining the status code instead of hardcoding numeric values. In this case, we use `HttpStatus.MOVED_PERMANENTLY` (301).

### 4. Options Object

- This optional object is useful for logging purposes. It can include additional information such as a description of the error or the cause of the exception.
- Note: The contents of this object will not be sent to the client but can be used for internal logging or debugging.
