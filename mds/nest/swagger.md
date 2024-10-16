# Documentation

## Table of Contents

- [Introduction](#introduction)
- [Swagger Configuration in NestJS](#swagger-configuration-in-nestjs)
  - [Install Swagger](#install-swagger)
  - [Configure Swagger](#configure-swagger)
- [Documenting Controllers with Swagger](#documenting-controllers-with-swagger)
- [Documenting DTOs with Swagger](#documenting-dtos-with-swagger)
  - [Documenting Mapped Types DTO](#documenting-mapped-types-dto)

## Introduction

- [**openapis.org**](https://www.openapis.org) : The OpenAPI Specifications provides a formal standard for describing HTTP APIs.
- [**swagger.io/tools/swagger-ui**](https://swagger.io/tools/swagger-ui/) : Tool used to document and visualize RESTful APIs using OpenAPI Specifications.

## Swagger Configuration in NestJS

### Install Swagger

The [Swagger Module](https://docs.nestjs.com/openapi/introduction) integrates Swagger with NestJS, allowing you to document your APIs effectively.

```bash
npm i @nestjs/swagger
```

### Configure Swagger

```ts
// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("NestJs Blog App API")
    .setDescription("Use the base API URL as http://localhost:3000")
    .setTermsOfService("http://localhost:3000/terms-of-service")
    .setLicense("MIT License", "https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt")
    .addServer("http://localhost:3000")
    .setVersion("1.0")
    .build();

  // Instantiate Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
```

- `DocumentBuilder` : Used to set up metadata like title, description, version, etc. for your API documentation.
- `SwaggerModule.createDocument()` : Generates the API documentation using the metadata and decorators spread throughout the application.
- `SwaggerModule.setup` : Sets up the Swagger UI at the specified path (e.g. `/api`).

## Documenting Controllers with Swagger

Swagger decorators are used to add metadata to controllers and endpoints.

```ts
// users/users.controller.ts
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

@Controller("users")
@ApiTags("Users")
export class UsersController {
  @ApiOperations({ summary: "Fetches user data" })
  @ApiResponse({ status: 200, description: "User fetched successfully" })
  @ApiQuery({
    name: "limit",
    type: "number",
    required: "false",
    description: "The number of entries returned per query",
    example: 10,
  })
  @Get("/:id")
  public getUser(@Param("id", ParseIntPipe) id: number) {}
}
```

- `@ApiTags('Users')` : Groups all related endpoints under the 'Users' tag in the Swagger UI.

- `@ApiOperation({ summary })` : Provides a summary for the endpoint, explaining its purpose.

- `@ApiResponse({ status, description })` : Defines possible responses for the endpoint.

- `@ApiQuery({ name, type, required, description, example })` : Adds detailed documentation for query parameters.

## Documenting DTOs with Swagger

```ts
// posts/dtos/create-post.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
  @ApiProperty({
    example: "This is a title",
    description: "This is the title for the blog post",
  })
  title: string;

  @ApiPropertyOptional({
    type: "array",
    required: false,
    items: {
      type: "object",
      properties: {
        key: {
          type: "string",
          description: "The key can be any string identifier for your meta option",
          example: "sidebarEnabled",
        },
        value: {
          type: "any",
          description: "Any value that you want to save to the key",
          example: true,
        },
      },
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
```

- `@ApiProperty()` : Describes required properties with example and description.
- `@ApiPropertyOptional()` : Similar to `@ApiProperty()` but used for optional fields.

### Documenting Mapped Types DTO

```ts
// posts/dtos/patch-post.dto.ts
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreatePostDto } from "./create-post.dto";

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: "The ID of the post that needs to be updated",
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
```

- `extends PartialType(CreatePostDto)` : Inherits all properties from `CreatePostDto` as optional, following the DRY principle.

- `PartialType` here is imported from `@nestjs/swagger` instead of `@nestjs/mapped-types`, so that the documentation of `CreatePostDto` will be added to `PatchPostDto` at the Swagger UI.
