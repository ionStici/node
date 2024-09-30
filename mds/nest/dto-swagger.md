# Complex DTO with Swagger

How to use Swagger and class validation decorators in NestJS to create well-documented, validated API endpoints for managing blog posts.

## Controller Example

```ts
// posts/posts.controller.ts
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PatchPostDto } from "./dtos/patch-post.dto";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
  @ApiOperation({
    summary: "Creates a new blog post",
  })
  @ApiResponse({
    status: 201,
    description: "You get a 201 response if your post is created successfully.",
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }

  @ApiOperation({
    summary: "Updates an existing blog post",
  })
  @ApiResponse({
    status: 200,
    description: "A 200 response if the post is updated successfully.",
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
  }
}
```

- `@APiTags("Posts")` : Groups related endpoints under "Posts" in the Swagger UI.
- `@ApiOperation({ summary })` : Describes the purpose of the endpoint for easier understanding.
- `@ApiResponse({ status, description })` : Specifies possible responses, including status codes and messages.

## DTO Example

```ts
// posts/dtos/create-post.dto.ts
import { postType } from "../enums/postType.enum";
import { postStatus } from "../enums/postStatus.enum";
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from "class-validator";
import { CreatePostMetaOptionsDto } from "./create-post-meta-options.dto";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
  @ApiProperty({
    example: "This is a title",
    description: "This is the title for the blog post",
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: "Possible values: 'post', 'page', 'story', 'series'",
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    example: "my-blog-post",
    description: "For example - 'my-url'",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'A slug should be all small letters and uses only "-" and without spaces. For example "my-url".',
  })
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: "Possible values: 'draft', 'scheduled', 'review', 'published'",
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: "This is the content of the post",
    example: "The post content",
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: "Serialize your JSON object else a validation error with be thrown",
    example: '{\r\n "@context": "https://schema.org",\r\n "@type": "Person"\r\n }',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional({
    description: "Featured image for your blog post",
    example: "http://localhost.com/images/image1.jpg",
  })
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: "The date on which the blog post is published",
    example: "2024-03-16T07:46:32+0000",
  })
  @IsISO8601()
  @IsOptional()
  publishOn: Date;

  @ApiPropertyOptional({
    description: "Array of tags passed as string values",
    example: ["nestjs", "typescript"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

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
  metaOptions?: CreatePostMetaOptionsDto[]; // Nested DTO
}
```

_Swagger Decorators:_

- `@ApiProperty()` : Describes required properties with example and description.
- `@ApiPropertyOptional()` : Similar to `@ApiProperty()` but used for optional fields.

_Validation Decorators:_

- `@IsString`, `@IsNotEmpty` : Validates that the value is a not-empty string.
- `@IsEnum` : Restricts value to the enum type.
- `@IsOptional` : Marks the property as optional.
- `@IsISO8601` : Validates that the value follows the ISO 8601 date format.
- `@Matches` : Enforces specific patterns using regular expressions.
- `@ValidateNested` : Validates nested properties within an array.
- `@Type()` (from `class-transformer`) : Handles type conversion for nested DTOs.

## Nested DTO

```ts
// posts/dtos/create-post-meta-options.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostMetaOptionsDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}
```

## Mapped Types DTO

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

  `PartialType` here is imported from `@nestjs/swagger` instead of `@nestjs/mapped-types` so that the documentation of `CreatePostDto` will be added to `PatchPostDto` at the Swagger UI.

- `@ApiProperty` : Adds description to the `id` property.
- `@IsInt`, `@IsNotEmpty` : Indicates that `id` is an integer and must not be empty.

## Request Example

```json
// posts/http/posts.post.endpoints.http

POST http://localhost:3000/posts
Content-Type: application/json

{
  "title": "What's new with NestJS",
  "postType": "post",
  "slug": "new-with-nestjs",
  "status": "draft",
  "content": "test content",
  "schema": "{\r\n \"@context\": \"https:\/\/schema.org\",\r\n \"@type\": \"Person\"\r\n }",
  "featuredImageUrl": "http://localhost.com/images/image1.jpg",
  "publishOn": "2024-03-16T07:46:32+0000",
  "tags": ["nestjs", "typescript"],
  "metaOptions":[
    {
      "key": "testKey",
      "value": 20
    }
  ]
}
```
