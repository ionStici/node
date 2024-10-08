# Introduction to Exception Handling

## Table of Contents

- [What Are Exceptions?](#what-are-exceptions)
- [How Does NestJS Handle Exceptions?](#how-does-nestjs-handle-exceptions)
- [NestJS Exception Handling Overview](#nestjs-exception-handling-overview)

## What Are Exceptions?

An **exception** is an event that occurs during the execution of a program that disrupts the normal flow of instructions. These can be caused by a variety of reasons, such as:

- **Invalid Input:** For instance, a user submits a form without required fields.
- **Unauthorized Access:** When a user attempts to access a resource without proper credentials.
- **Resource Not Found:** Trying to access a resource that doesn’t exist.
- **Internal Server Errors:** When something goes wrong on the server, like database connection issues or uncaught runtime errors.

When an exception occurs, the application needs a structured way to catch these errors and respond appropriately, without crashing or exposing sensitive data.

## How Does NestJS Handle Exceptions?

NestJS follows a layered approach to handle exceptions. The framework automatically catches unhandled exceptions and generates an appropriate HTTP response. If an error occurs anywhere in the request lifecycle (within controllers, services, guards, pipes, etc.), NestJS intercepts it and transforms it into a valid HTTP response.

By default, NestJS responds with the following:

- **500 Internal Server Error:** If an unhandled exception occurs.
- **400 Bad Request:** For invalid input data or bad requests.
- **404 Not Found:** For missing resources.
- **403 Forbidden:** For access control issues.
- **401 Unauthorized:** For authentication errors.

### Built-in Exception Classes

NestJS provides a set of pre-defined exception classes that map to common HTTP errors:

- `BadRequestException` (400)
- `UnauthorizedException` (401)
- `ForbiddenException` (403)
- `NotFoundException` (404)
- `InternalServerErrorException` (500)

These classes can be thrown within your code to explicitly handle specific error cases. For example, if a user tries to access a resource that doesn't exist, you can throw a `NotFoundException` to inform the user about the missing resource.

```ts
throw new NotFoundException("Resource not found");
```

## NestJS Exception Handling Overview

**Exception handling in NestJS:** ensure errors are managed properly throughout the request-response lifecycle.

### Request and Response Lifecycle

NestJS has built-in mechanisms to automatically handle exceptions that occur within the application. Exceptions are captured across various components, including: Guards, Interceptors, Pipes, Controllers, Services.

Without custom handling, NestJS defaults to sending `500 Internal Server Error` responses to the client. While this provides basic error feedback, it's essential to offer more meaningful messages for debugging and proving user experience.

### Built-in Exception Filters

NestJS provides several [**built-in HTTP exceptions**](https://docs.nestjs.com/exception-filters#built-in-http-exceptions) that can be used to handle common scenarios: `BadRequestException`, `UnauthorizedException`, `NotFoundException`.

These exceptions allow you to define specific responses based on the type of error. NestJS captures exceptions and sends an appropriate HTTP response to the client.

### Exception Handling in Services

Best practice in NestJS is to handle exceptions **inside the service layer**, where the business logic resides. The controller's role is limited to routing requests, while the actual error handling should be delegated to services. This ensures that exceptions related to business logic are managed effectively and can be customized as needed.
