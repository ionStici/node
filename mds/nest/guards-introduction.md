# Introduction to Guards

**Guards** are a NestJS feature used to **approve or deny** requests based on certain conditions.

## What Are Guards

- **Guards** act as a middleware layer, their main function is to control whether a request should be **processed** or **denied**.
- Guards are often used for **authorization** and **authentication** purposes, making sure users are allowed to access certain routes.
- A guard can either: **(1) Allow** the request to proceed, or **(2) Reject** the request and throw an appropriate exception (e.g. Unauthorized).

## Applying Guards

Guards can be applied at different levels:

1. **Controller Level:** The guard is applied to all the routes within the controller.
2. **Method Level:** The guard is applied to individual methods (endpoints) within the controller.
3. **Global Level:** The guard can be applied to the entire application.

You can control where and how the guard is applied using the `@UseGuard()` decorator.

### Example: Applying Guards

```ts
import { UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "./guards/access-token.guard";

@Controller("users")
@UseGuards(AccessTokenGuard) // Guard applied to all methods
export class UsersController {
  @Get()
  @UseGuards(AccessTokenGuard) // Guard applied only to this method
  findUser() {}
}
```

This example shows how to apply a guard to the entire controller or to a specific method within the controller.

The `@UseGuards()` decorator receives a guard as a parameter that will verify if the request can proceed or not.

## Use Cases of Guards

- **Authentication:** Guards can check if the request includes a valid JWT token for authentication.

- **Authorization:** Guards can ensure that the user has the necessary permissions (roles) to access certain resources.

- **Custom Conditions:** You can implement any custom logic in a guard, for example checking whether a user's account is active before allowing them to proceed.
