# Interceptors and Serialization in NestJS

NestJS interceptors are a powerful feature that allows you to **intercept and manipulate incoming requests and outgoing responses**. They can be used for various purposes such as logging, transforming responses, handling errors, and more.

**Serialization**, on the other hand, is the process of transforming complex data types (like entities) into plain JavaScript objects that can be easily sent over the network. In NestJS, serialization often involves controlling which properties of an entity are exposed to the client.

## Serializing the User Entity

Serialization ensures that sensitive information (like passwords) is not sent to the client.

```ts
// users/users.controller.ts
import { ClassSerializerInterceptor, UseInterceptors } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @UseInterceptors(ClassSerializerInterceptor)
  public createUser() {
    // ...
  }
}
```

`@UseInterceptors(ClassSerializerInterceptor)` : This ensures that the response of the `createUser` method is serialized according to the rules defined in the entity class, before being sent to the client.

```ts
// users/user.entity.ts
import { Exclude } from "class-transformer";

@Entity()
export class User {
  // ...

  @Exclude()
  @Column({ type: "varchar", length: 96, nullable: false })
  password: string;
}
```

`@Exclude` : This decorator from `class-transformer` marks the `password` property to be excluded from the serialized output. As a result, when a `User` entity is returned in a response, the `password` field will not be included, enhancing security.

## Creating a Global Data Response Interceptor

Interceptors can also be applied globally, affecting all controllers and routes within your application.

```bash
npx nest g interceptor /common/interceptors/data-response --no-spec
```

```ts
// src/common/interceptors/data-response/data-response.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Hello");

    return next.handle().pipe(tap((data) => console.log("Bye", data)));
  }
}
```

The `DataResponseInterceptor` interceptor will log `Hello` before the request is handled, and then will log `Bye` after the response is sent.

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DataResponseInterceptor } from "./common/interceptors/data-response/data-response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add Global Interceptor
  app.useGlobalInterceptors(new DataResponseInterceptor());

  await app.listen(3000);
}
bootstrap();
```

To apply an interceptor globally, you have to register it in the `main.ts` file.

## Adding API Versions

```ts
// src/common/interceptors/data-response/data-response.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable, tap, map } from "rxjs";

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        apiVersion: this.configService.get("appConfig.apiVersion"),
        data: data,
      }))
    );
  }
}
```

```ts
// app.module.ts
import { APP_INTERCEPTOR } from "@nestjs/core";
import { DataResponseInterceptor } from "./common/interceptors/data-response/data-response.interceptor";

const ENV = process.env.NODE_ENV;

@Module({
  // ...

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
  ],
})
export class AppModule {}
```

Instead of registering the interceptor globally in `main.ts`, you can register it in the `AppModule` using the `APP_INTERCEPTOR` token. This approach integrates better with NestJS's dependency injection system, especially when the interceptor has dependencies like `ConfigService`.
