# REST API

## Table of Contents

- [Definition](#definition)
- [REST Design Principles](#rest-design-principles)
  - [1. Client-Server Separation](#1-client-server-separation)
  - [2. Uniform Interface](#2-uniform-interface)
  - [3. Statelessness](#3-statelessness)
  - [4. Cacheability](#4-cacheability)
  - [5. Layered Architecture](#5-layered-architecture)
- [Anatomy of an API Endpoint](#anatomy-of-an-api-endpoint)
  - [Params vs Query](#params-vs-query)
  - [Body Object Example](#body-object-example)
- [Development Environment](#development-environment)

## Definition

A **REST API** (Representational State Transfer) is an Application Programming Interface (API) that follows the principles of REST architecture, enabling communication between a client and a server.

## REST Design Principles

_These are the core principles that guide REST API architecture:_

### 1. Client-Server Separation

In a **REST API**, the client and server are completely independent. The client sends a request using API endpoints, and the server responds to that request. The client and server interact only **through API endpoints** - they do not depend on each other's codebases.

Clients use HTTP methods to interact with resources on the server:

- `GET` - Retrieves data from a specified resource.
- `POST` - Submits data to be processed to a specified resource.
- `DELETE` - Deletes a specified resource.
- `PUT` - Replaces the current resource with new data.
- `PATCH` - Partially updates a resource.

### 2. Uniform Interface

Requests for the same resource should follow a consistent structure regardless of the client making the request. This ensures predictability in how the API behaves.

### 3. Statelessness

REST APIs are **stateless**, meaning that each request from the client contains all the information needed for the server to process it. The server does not store any client state between requests.

### 4. Cacheability

Where possible, REST resources should be **cacheable**. Both the client and server can cache responses to improve performance and scalability. However, the client’s cache and the server’s cache are independent.

### 5. Layered Architecture

REST APIs need to be designed so that neither the client nor the server can tell whether it communicates with the end application or an intermediary.

## Anatomy of an API Endpoint

**Example:** `GET https://apiurl.com/posts/author/?limit=10&offset=20`

1. **HTTP verb**: `GET` (type of request)
2. **Domain**: `https://apiurl.com/`
3. **Route**: `/posts/` (resource)
4. **Params**: `/author/` (path parameters)
5. **Query**: `/?limit=10&offset=20` (query parameters)
6. **Body**: `{"author": "John"}` (sent with certain request type like POST)

### Params vs Query

- **Params** `/author/` : Used to identify resources or categories.
- **Queries** `/?limit=10&offset=20` : Used to filter or modify the request results.

### Body Object Example

Whenever you send a POST, PUT, or PATCH request, a **body** is sent with the request to provide data:

```json
{
  author: {
    "id": 123,
    "name": "Jimmy"
    "username" : "jim"
  },
  "title": "",
  "description": "",
  "tags": []
}
```

## Development Environment

Tools like **Postman** or **httpYac** are used to send HTTP requests to the server in order to get a response and check if the application is working properly.
