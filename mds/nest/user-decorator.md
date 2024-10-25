# Custom Parameter Decorator

Custom parameter decorator that extracts the authenticated user's data directly from the request object. This approach avoids the need to query the database for user information on each request, as the data is already available from the decoded JWT payload.

## Creating the `@ActiveUser` Decorator

```ts
// auth/decorators/active-user.decorator.ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_USER_KEY } from "../constants/auth.constants";

export const ActiveUser = createParamDecorator((field: any, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest(); // HTTP Request Object

  // User data attached to the request, during authentication in a guard or middleware.
  const user = request[REQUEST_USER_KEY];

  return field ? user?.[field] : user;
});
```

The `ActiveUser` decorator uses `createParamDecorator` to extract the user data (ID, email) stored in the request object, which was decoded from the JWT during authentication.

## Using the `@ActiveUser` Decorator in a Controller

```ts
import { ActiveUser } from "src/auth/decorators/active-user.decorator";
import { ActiveUserData } from "src/auth/decorators/active-user.decorator";

@Controller("posts")
export class PostsController {
  createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
    // `user` contains the authenticated user's data from the JWT payload
  }
}
```

In `PostsController`, the `@ActiveUser()` decorator retrieves the authenticated user's data directly from the JWT payload, allowing the app to handle user-specific actions (like creating a post) without querying the database.
