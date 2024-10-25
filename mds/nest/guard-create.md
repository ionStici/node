# Implementing and Using Guards

## Implement AccessTokenGuard

```bash
# Generate the Guard using the CLI
npx nest g guard /auth/guards/access-token --no-spec
```

```ts
// auth/guards/access-token.guard.ts
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "src/auth/config/jwt.config";

export const REQUEST_USER_KEY = "user";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  // The main method that checks if a request is authorized
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Extract the request from the execution context
    const request = context.switchToHttp().getRequest();

    // 2. Extract the token from the request header
    const [_, token] = request.headers.authorization?.split(" ") ?? [];

    // 3. If the token is missing, throw UnauthorizedException
    if (!token) throw new UnauthorizedException();

    try {
      // Validate token and extract the payload
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      // If token is invalid, verifyAsync will throw an exception which will trigger catch

      // Attach payload to the request object
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
```

## Apply the Guard Globally

```ts
// app.module.ts
import jwtConfig from "./auth/config/jwt.config";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "./auth/guards/access-token.guard";

@Module({
  imports: [ConfigModule.forFeature(jwtConfig), JwtModule.registerAsync(jwtConfig.asProvider())],
  providers: [
    {
      provide: APP_GUARD, // Provides a global guard
      useClass: AccessTokenGuard, // Uses the AccessTokenGuard globally
    },
  ],
})
export class AppModule {}
```

`APP_GUARD` is a constant provided by NestJS that allows you to declare a global guard at the application level.

By adding the `APP_GUARD` and associating it with `AccessTokenGuard`, we make sure that all routes require authentication unless explicitly configured otherwise.
