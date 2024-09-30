# Documentation

## Table of Contents

- [Introduction](#introduction)
- [Swagger in NestJS](#swagger-in-nestjs)
- [Swagger Configuration in NestJS](#swagger-configuration-in-nestjs)
  - [Install Swagger](#install-swagger)
  - [Configure Swagger](#configure-swagger)
  - [Decorating Controllers](#decorating-controllers)

## Introduction

- [**`openapis.org`**](https://www.openapis.org) : Official site for the **OpenAPI Specification**, a standard for defining RESTful APIs to ensure consistent documentation and automation.
- [**`swagger.io/tools/swagger-ui`**](https://swagger.io/tools/swagger-ui/) : A **visual tool** by Swagger fpr exploring and testing APIs defined by the OpenAPI Specification.

## Swagger in NestJS

Swagger Configuration in NestJS
**Swagger** is used to **document and visualize RESTful APIs** interactively, making it easier to understand and rest endpoints. Integrated with the **OpenAPI Specification**, Swagger UI helps ensure API documentation is clear, consistent and accessible as your NestJS project grows. It documents endpoints, routes, request parameters, and responses. simplifying API integration and maintenance.

## Swagger Configuration in NestJS

### Install Swagger

The [Swagger Module](https://docs.nestjs.com/openapi/introduction) integrates Swagger with NestJS, allowing you to document your APIs effectively.

```bash
npm i @nestjs/swagger
```

### Configure Swagger

Decorating Controllers
Set up Swagger in your app's entry file `main.ts`:

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

- `DocumentBuilder` : Used to set up metadata like title, description, version, etc., for your API documentation.
- `SwaggerModule.createDocument()` : Generates the API documentation using metadata and controller decorators.
- `SwaggerModule.setup()` : Sets up the Swagger UI at the specified path (e.g., `/api`).

### Decorating Controllers

Swagger decorators are used to add metadata to controllers and endpoints:

```ts
// users/users.controller.ts
import { ApiTags } from "@nestjs/swagger";

@Controller("users")
@ApiTags("Users")
export class UsersController {}
```

- `@ApiTags("Users")` : Groups endpoints logically under the "Users" tag in the Swagger UI.
