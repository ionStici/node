# Inter-Module and Circular Dependency

## Table of Contents

- [Inter-Module Dependency Injection](#inter-module-dependency-injection)
  - [1. Export a Provider from the Module](#1-export-a-provider-from-the-module)
  - [2. Importing the Module](#2-importing-the-module)
  - [3. Injecting the Service](#3-injecting-the-service)
- [Circular Dependency Injection](#circular-dependency-injection)
  - [1. Auth and Users Modules](#1-auth-and-users-modules)
  - [2. Auth and Users Services](#2-auth-and-users-services)

## Inter-Module Dependency Injection

**Inter-Module Dependency Injection:** One module depends on a service from another module.

### 1. Export a Provider from the Module

To allow another module to use a service, the service must be **exported** from its module.

```ts
// users/users.module.ts
import { UsersService } from "./providers/users.service";

@Module({ exports: [UsersService] })
export class UsersModule {}
```

### 2. Importing the Module

The module that needs to use another service must **import** the entire module that contains that service.

```ts
// auth/auth.module.ts
import { UsersModule } from "src/users/users.module";

@Module({ imports: [UsersModule] })
export class AuthModule {}
```

### 3. Injecting the Service

The service can then be injected into any component within the importing module using dependency injection.

```ts
// auth/providers/auth.service.ts
import { UsersService } from "src/users/providers/users.service";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
}
```

## Circular Dependency Injection

**Circular Dependency:** Two modules rely on each other's services, creating a circular reference. In this case, we need to use `forwardRef()` to let NestJS know that these modules are interdependent.

### 1. Auth and Users Modules

```ts
// auth/auth.module.ts
import { AuthService } from "./providers/auth.service";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

```ts
// users/users.module.ts
import { UsersService } from "./providers/users.service";
import { AuthModule } from "src/auth/auth.module.ts";

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [AuthModule],
  exports: [AuthModule],
})
export class UsersModule {}
```

### 2. Auth and Users Services

The services that are dependent on each other must use `forwardRef()` combined with the `@Inject()` decorator to resolve the dependency.

```ts
// auth/providers/auth.service.ts
import { Injectable, forwardRef, Inject } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}
}
```

```ts
// users/providers/users.service.ts
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}
}
```
