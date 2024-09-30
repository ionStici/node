# Documenting with Swagger

## DTOs with Swagger Decorators

```ts
// users/dtos/get-users-param.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: "Get user with a specific id",
    example: 1234,
  })
  id?: number;
}
```

- `@ApiPropertyOptional` : Describes an optional property in the DTO, providing information like description and example value. This adds clarity to the Swagger documentation, indicating what the property represents.

## Swagger Decorators in Controller

```ts
// users/users.controller.ts
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("users")
@ApiTags("Users")
export class UsersController {
  @Get("/:id?")
  @ApiOperation({
    summary: "Fetches a list of registered users on the application",
  })
  @ApiResponse({
    status: 200,
    description: "Users fetched successfully based on the query",
  })
  @ApiQuery({
    name: "limit",
    type: "number",
    required: false,
    description: "The number of entries returned per query",
    example: 10,
  })
  @ApiQuery({
    name: "page",
    type: "number",
    required: false,
    description: "The position of the page number that you want the API to return",
    example: 1,
  })
  public getUsers() {}
}
```

- `@ApiTags("Users")` : Groups all endpoints related to users under the "Users" section in Swagger UI.
- `@ApiOperation({ summary })` : Provides a summary for the endpoint, explaining its purpose.
- `@ApiResponse({ status, description })` : Defines the possible response for the endpoint, including status and description.
- `@ApiQuery({ name, type, required, description, example })` : Adds detailed documentation for query parameters, specifying their type, required status, description, and examples.

These Swagger decorators provide precise documentation for each API endpoint, covering route parameters, query parameters, responses, and overall endpoint purpose. This results in detailed, easy-to-use Swagger documentation that developers can directly interact with and test, improving collaboration and reducing integration issues.
