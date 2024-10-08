# Module Configuration and Partial Registration

**Module-specific configurations** in NestJS using **partial registration**.

## 1. Creating a Module-Specific Configuration File

Here we define a `profileConfig` namespace using the `registerAs` function, this allows the configuration to be scoped only to a specific module, not globally across the app.

```ts
// users/config/profile.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("profileConfig", () => ({
  apiKey: process.env.PROFILE_API_KEY,
}));
```

This file exports the `profileConfig` object which holds a value `apiKey` fetched from the environment variables. This keeps the configuration encapsulated and accessible only where needed.

## 2. Injecting the Configuration into the Module

Here we import the `profileConfig` namespace and make it available only to this module by using `imports: [ConfigModule.forFeature(profileConfig)]`.

```ts
// users/users.module.ts
import { ConfigModule } from "@nestjs/config";
import profileConfig from "./config/profile.config";

@Module({
  imports: [ConfigModule.forFeature(profileConfig)],
})
export class UsersModule {}
```

## 3. Accessing the Configuration in the Service

Now, we can inject the `profileConfig` directly into services and use the environment variables it provides.

```ts
// users/providers/users.service.ts
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import profileConfig from "./../config/profile.config";

@Injectable()
export class UsersService {
  constructor(
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>
  ) {}

  test() {
    const apiKey = this.profileConfiguration.apiKey;
  }
}
```

- `@Inject(profileConfig.KEY)` : This allows us to inject the `profileConfig` using its registered key.
- `ConfigType<typeof profileConfig>` : Provides full type safety when accessing the configuration properties, allowing you to use `profileConfiguration.apiKey` with autocompletion.

This approach allows sensitive configuration values (like API keys) to be isolated to a specific module and not exposed globally.
