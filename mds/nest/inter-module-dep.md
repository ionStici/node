# Inter-Module Dependency Injection

**Inter-Module Dependency Injection:** One module depends on a service from another module.

_Steps to implement inter-module dependency injection:_

## 1. Exporting a Provider

To allow another module to use a service, the service must be **exported** from its module.

```ts
// users/users.module.ts
import { UsersService } from "./providers/users.service";

@Module({
  exports: [UsersService],
})
export class UsersModule {}
```

In this case, `UsersService` is exported from `UsersModule`.

## 2. Importing the Module

The module that needs to use the exported service must **import** the entire module.

```ts
// posts/posts.module.ts
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule],
})
export class PostsModule {}
```

`PostsModule` imports `UsersModule`, allowing access to the exported `UsersService`.

## 3. Injecting the Service

The service can then be **injected** into any component within the importing module using dependency injection, as with intra-module injections.

```ts
// posts/providers/posts.service.ts
import { UsersService } from "src/users/providers/users.service";

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    const user = this.usersService.findUserById(userId);
    const posts = [];

    return [user, posts];
  }
}
```

In `PostsService`, we inject `UsersService` to find the user that a post belongs to.

## Key Points

- **Exporting Providers:** Providers like services can only be shared between modules if explicitly exported. Controllers cannot be exported, only providers.
- **Importing Modules:** You import the **entire module** instead of a specific service. However, only the services marked in the `exports` array are made available to other modules.
- **Injection:** Once a module is imported, its exported services can be injected as dependencies in the target module using the constructor, similar to intra-module dependency injection.
