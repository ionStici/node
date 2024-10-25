# Interceptors and Serialization

## Serializing User Entity

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

## Global Data Interceptor

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
    console.log("before ...");

    return next.handle().pipe(tap((data) => console.log("after ... ", data)));
  }
}
```

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
