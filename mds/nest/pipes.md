# Pipes in NestJS

- [**Pipes**](https://docs.nestjs.com/pipes#built-in-pipes) : transform and validate incoming data before it reaches the controller.

```ts
import { Controller, Get, Param, Query, ParseIntPipe, DefaultValuePipe } from "@nestjs/common";

@Controller("posts")
export class PostsController {
  @Get("/:id")
  public getPost(
    @Param("id", ParseIntPipe) id: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {}
}
```

- **`ParseIntPipe`** : built-in pipe that validates and transforms a value into an integer.

  - If `id` is `'123'`, then `ParseIntPipe` will transform it into the integer `123`.
  - If `id` is `'abc'`, it will result in a validation error, and NestJS will automatically throw a Bad Request error.
  - Even if `id` is marked as optional (e.g. `/:id?`), pipes like `ParseIntPipe` will assume that the parameter is required, unless explicitly handles using techniques like DTOs.

- **`DefaultValuePipe`** : Pipe used to assign a default value of they are not provided in the request.
