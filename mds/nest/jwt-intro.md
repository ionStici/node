# Json Web Tokens (JWT)

## What are JSON Web Tokens (JWT)

- [Introduction to JSON Web Tokens](https://jwt.io/introduction)

- [**JWT (JSON Web Token)**](https://jwt.io) is an open standard (RFC 7519) for securely transmitting information between two parties (client and server) in the form of a JSON object.

- JWTs are widely used in **authentication** and **authorization** processes.

## Structure of a JWT

A JWT consists of three parts - (1) Header, (2) Payload, (3) Signature - each separated by a period `.`

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 1. Header

The **header** contains metadata about the token, such as the type of token (typically `JWT`) and the signing algorithm used (e.g. `HS256`).

```json
// Encoded
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

// Decoded
{
  "alg" : "HS256",  // Algorithm used
  "typ" : "JWT"     // Token type
}
```

### 2. Payload

- The **payload** contains the claims, the data you want to share. This is usually user-related information like the user ID or email.
- **Important:** The payload is **encoded** but not **encrypted**. Anyone with the token can view its contents, so **never store sensitive information** (like passwords or private keys) in the payload.

```json
// Encoded
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ

// Decoded
{
  "sub": "1234567890", // Subject (typically user ID)
  "name": "John Doe",  // Example data
  "iat": 1516239022    // Issued at (timestamp)
}
```

### 3. Signature

- The **signature** is used to verify that the message wasn't tampered with. The server generates the signature by encoding the header and payload, combining them with a secret key, and signing them using the algorithm specified in the header.
- This ensures the **integrity** of the token.

```json
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

The signature ensures that if the token's data (header or payload) is changed, the token will be invalid because the signature will no longer match.

## How JWT Works

### 1. User Authentication

- The user sends their email and password to the server.
- If the credentials are correct, the server generates a JWT and sends it to the user. This JWT contains user information (like their ID or email) and is signed with the server's secret key.

### 2. Token-Based Requests

- After the JWT is received, the user can store it (typically in local storage or cookies) and include it in the `Authorization` header of future requests.
- The server verifies the token by checking its **signature**. If the token is valid, the server allows access to the requested resource.
- The token has an **expiration time** (TTL - Time to Live), after which the user must re-authenticate.

## Why Use JWT for Authentication

- **Stateless:** JWT allows for **stateless authentication**, meaning the server doesn't need to keep session data. All the required information is stored in the token.
- **Integrity:** The **signature** ensures that the token hasn't been tampered with.
- **Authorization:** JWTs are often used in securing APIs. After logging in, each request to a protected endpoint will include the token, and the server will use it to authorize the request.

## JWT Security Considerations

- **Do not store sensitive information** like passwords in the payload, as it can be decoded easily.
- The secret key used to sign the token should be kept secure on the server.
- Tokens should have a **short expiration time** to reduce the risk of theft.

## Process Overview

### 1. User Login

- The user sends credentials (username and password).
- If valid, the server generates a JWT and returns it.

### 2. Subsequent Requests

- The user includes the JWT in the `Authorization` header (`Bearer <token>`).
- The server validates the token, checking the signature and expiration time.
- If valid, the server processes the request.

### 3. Token Validation

- The server checks that the JWT's **signature** matches what was generated using its secret key.
- If the token has been tampered with or is expired, the server rejects it.

## Conclusion

JWT is a powerful tool for securing API requests and user authentication. By ensuring that tokens are securely signed and validated, you can provide stateless, scalable authentication in your applications.
