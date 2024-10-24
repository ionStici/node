# Authentication

## Hashing and Salting using Bcrypt

### Hashing

**Hashing:** The process of converting plaintext into a unique fixed-size string of characters known as a hash value, ensuring the integrity of the original data. Given the same input, the hash function will always produce the same output hash value.

Hashing is **one-way**, meaning it cannot be reverted to get the original input. When a user logs in using a password, the password is hashed and the system compares it to the stored hash from the database, if the hashes match then the user is successfully authenticated.

### Salting

**Salting:** Security technique that adds a random & unique value (salt) to a plaintext password before hashing it. This ensures that even if two users have the same password, their hashed values will be different due to the unique salt applied to each password.

### Bcrypt

**`bcrypt`** is a **hashing algorithm** that automatically handles **salting** and ensures strong security by adjusting the cost factor. It’s a one-way function that transforms a plaintext password into a fixed-length, cryptographically secure hash value.

The same `bcrypt` algorithm is used to compare passwords during login by hashing the provided password and checking it against the stored hash.

```makefile
# bcrypt generated hash example
$2y$10$EixZaYVK1fsbw1Zfbx3OX.eWoEXJ3pOLe/9P1slvGoFUJGAjy/yKa
```

- `$2y$` : Indicates the bcrypt algorithm version.
- `$10$` : The **cost factor**, which defines the computational complexity.
- The next part until the dot is the **salt**.
- The last part after the dot is the **hash value**.

## JSON Web Tokens (JWT)

[**JWT (JSON Web Token)**](https://jwt.io) is an open standard for securely transmitting information between two parties (client and server) in the form of a JSON object. JWTs are widely used in **authentication** and **authorization** processes.

### Structure of a JWT Token

A JWT token consists of three parts, (1) Header, (2) Payload, (3) Signature, each separated by a period `.`

```makefile
# JWT Token Example
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. # Header
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ. # Payload
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c # Signature
```

1. The **header** contains metadata about the token, such as the token type and the signing algorithm:

```json
// HEADER Encoded
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

// Decoded
{
  "alg" : "HS256",  // Algorithm used
  "typ" : "JWT"     // Token type
}
```

2. The **payload** contains the claims, the data you want to share. This is usually user-related information like the user ID or email. Consider that the payload is **encoded** and not **encrypted**. Anyone with the token can view its contents, so never store sensitive information in the payload.

```json
// PAYLOAD Encoded
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ

// Decoded
{
  "sub": "1234567890", // Subject (typically user ID)
  "name": "John Doe",  // Example data
  "iat": 1516239022    // Issued at (timestamp)
}
```

3. The **signature** is used to verify that the message wasn't tampered with. The server generates the signature by encoding the header and payload, combining them with a secret key, and signing them using the algorithm specified in the header. This ensures the **integrity** of the token. The signature ensures that if the token's data (header or payload) is changed, the token will be invalid because the signature will no longer match.

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  your-256-bit-secret
)
```

Paste a JWT token into the JWT.io debugger to decode it.

### How JWT Works

1. The client sends credentials to the server. If the credentials are correct, the server generates a JWT token and sends it to the client. The client receives and stores the JWT token.

2. For requests that need authorization, the client includes the JWT token in the request header. The server takes the token the client sent and verifies it by checking its signature. If the token is valid, the server allows access to the requested resource.

3. The token has an **expiration time** (TTL, Time to Live), after which the user must re-authenticate.

### Why use JWT for Authentication

- **Stateless:** JWT allows for **stateless authentication**, meaning the server doesn't need to keep session data. All the required information is stored in the token.

- **Integrity:** The **signature** ensures the integrity of the token, if any part of the token is modified, the signature will no longer match making the token invalid.

- **Authorization:** JWTs are often used in securing APIs. After logging in, each request to a protected endpoint will include the token, and the server will use it to authorize the request.

### JWT Considerations

- JWT tokens are **not encrypted**, instead they are **signed**.

- **Do not share sensitive information** like passwords in the payload.

- The **secret key** used to sign the token should be kept secure on the server.

- Tokens should have **short expiration times** to reduce the risk of theft (e.g. 3600 seconds = 1 hour).

- **Refresh Tokens:** To avoid users having to log in frequently, refresh tokens can be implemented. Refresh tokens allow the user to request a new access token without authenticating again.
