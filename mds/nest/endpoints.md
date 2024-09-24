# What is an Endpoint

- **Endpoint:** A URL path or address that defines where a specific resource or action in an API can be accessed.

- **API:** An interface that allows different software applications to communicate with each other. Endpoints are how the client communicates with the API.

- In REST APIs, an endpoint is **the URL where clients send requests**.

## Components of an Endpoint

`GET https://api.example.com/users/123/?limit=10&page=2`

1. **HTTP Method** : The type of action the client wants to perform.

2. **URL (Uniform Resource Locator)** : The specific address for the resource.

   Example: `https://api.example.com/`

3. **Resource** : The specific data or functionality you want to interact with.

   Example: `/users/123`

4. **Query Parameters** (optional) : Used to filter or modify the request.

   Example: `/?limit=10&page=2`

5. **Request Body** (for methods like POST/PUT) : Data sent along with the request when creating or updating a resource.

   Example: `{ "message" : "Hello, World!" }`

## Why are Endpoints Important?

- **Client-Server Communication** : Endpoints define the specific URLs where the client (like a browser or mobile app) can interact with the server. Without endpoints, the client wouldn't know where to send requests or how to get data.
- **Resource Interaction** : Endpoints enable the client to perform actions like **retrieving** (GET), **creating** (POST), **updating** (PUT/PATCH), or **deleting** (DELETE) resources.

## Endpoint in NestJS Context

In NestJS, you define endpoints using **controllers** and HTTP **decorators**.

```ts
@Controller("users")
export class UsersController {
  @Get(":id")
  public getUser(@Param("id") id: string) {
    return `Get user with ID: ${id}`;
  }
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return "Create a new user";
  }
}
```

- **GET** `/users/:id` : An endpoint that retrieves a user by ID.
- **POST** `/users` : An endpoint that creates a new user.

## Conclusion

An **endpoint** is essentially a **URL path** in an API that represents a **resource** or **action**. Clients communicate with servers via these endpoints by making requests using HTTP methods (like GET, POST, etc.). Endpoints are the core of any API, allowing clients to interact with server-side resources.
