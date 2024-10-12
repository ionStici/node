# Decorators

```bash
npx nest g d auth/decorators/auth --flat --no-spec
```

```ts
// auth/constants/auth.constants.ts
export const AUTH_TYPE_KEY = "authType";
```

```ts
// auth/enums/auth-type.enum.ts
export enum AuthType {
  Bearer,
  None,
}
```

```ts
// auth/decorators/auth.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { AuthType } from "../enums/auth-type.enum";
import { AUTH_TYPE_KEY } from "../constants/auth.constants";

export const Auth = (...authTypes: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
```

```ts
// users/users.controller.ts
@Controller("users")
export class UsersController {
  @Post()
  // @SetMetadata('authType', 'None')
  @Auth(AuthType.None)
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
```
