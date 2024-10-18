# ActiveUserDecorator

This code retrieves user data from the request object using the JWT payload, eliminating the need to query the database on each request. Here's what happens:

```ts
// auth/decorators/active-user.decorator.ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_USER_KEY } from "../constants/auth.constants";

export interface ActiveUserData {
  // ID of the user
  sub: number;
  email: string;
}

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData = request[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  }
);
```

The `ActiveUser` decorator uses `createParamDecorator` to extract the user data (ID, email) stored in the request object, which was decoded from the JWT during authentication.

```ts
import { ActiveUser } from "src/auth/decorators/active-user.decorator";
import { ActiveUserData } from "src/auth/decorators/active-user.decorator";

@Controller("posts")
export class PostsController {
  createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
    // `user` is extracted from the JWT payload, and so there is no need to query it from database
  }
}
```

In `PostsController`, the `@ActiveUser()` decorator retrieves the authenticated user's data directly from the JWT payload, allowing the app to handle user-specific actions (like creating a post) without querying the database.
