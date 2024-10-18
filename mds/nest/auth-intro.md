# Introduction to Authentication

## Table of Contents

- [Password-Based Authentication](#password-based-authentication)
- [Key Steps in the Authentication Process](#key-steps-in-the-authentication-process)
  - [1. Hashing and Salting Passwords](#1-hashing-and-salting-passwords)
  - [2. Authenticating the User](#2-authenticating-the-user)
  - [3. Issuing a JWT (JSON Web Token)](#3-issuing-a-jwt-json-web-token)
  - [4. Verifying JWT on Future Requests](#4-verifying-jwt-on-future-requests)
- [Key Components of JWT-Based Authentication](#key-components-of-jwt-based-authentication)
- [Hashing and Salting Passwords in NestJS with Bcrypt](#hashing-and-salting-passwords-in-nestjs-with-bcrypt)
  - [Why Hashing and Salting are Needed](#why-hashing-and-salting-are-needed)
  - [What is hashing](#what-is-hashing)
  - [How Does Hashing Work in Authentication](#how-does-hashing-work-in-authentication)
  - [What is Salting](#what-is-salting)
  - [Example of a Bcrypt-Generated Hash](#example-of-a-bcrypt-generated-hash)
  - [Why Use Bcrypt](#why-use-bcrypt)
  - [How Bcrypt Works](#how-bcrypt-works)
  - [Key Benefits](#key-benefits)

## Password-Based Authentication

- In password-based authentication, a user provides an **email** and **password** to sign up or log in.
- The main goal is to verify the identity of the user securely using hashed passwords and issuing a **JWT** (JSON Web Token) for further authenticated requests.

## Key Steps in the Authentication Process

### 1. Hashing and Salting Passwords

- **Passwords cannot be stored in plain text** for security reasons.
- Plain text passwords make it easy for developers or hackers to access sensitive user information, especially if a breach occurs.
- To prevent this, passwords are **hashed** and **salted** before being stored in the database.
- **Hashing:** Converts the password into a fixed-size string of characters, ensuring the original password cannot be recovered.
- **Salting:** Adds random data to the password before hashing to prevent common attacks like dictionary or rainbow table attacks.

### 2. Authenticating the User

- When a user tries to log in, they provide their **email and password**.
- The system compares the **hashed password stored in the database** with the **hash of the password provided by the user**.
- If the two hashes match, the user is successfully authenticated.

### 3. Issuing a JWT (JSON Web Token)

- Upon successful authentication, a **JWT token** is issued to the user.
- The JWT serves as proof of the user's identity, allowing them to make authenticated requests to secure endpoints.
- JWTs are compact, URL-safe tokens used to verify the user's identity without needing to pass the password again.

### 4. Verifying JWT on Future Requests

- When the user makes requests to protected endpoints, they must include the **JWT** in the request headers.
- The system **verifies the JWT** by checking its signature to ensure it hasn't been tampered with.
- If the JWT is valid and matches the one originally issued, the user is authorized to access the resource.

## Key Components of JWT-Based Authentication

- **JWT Token:** A token that carries information about the user and is used for further verification.
- **Password Hashing:** Protects user passwords by converting them into unreadable strings.
- **Salting:** Enhances password security by adding randomness to the hash.
- **Token Verification:** Ensures that only authorized users with valid tokens can access secure endpoints.

## Hashing and Salting Passwords in NestJS with Bcrypt

### Why Hashing and Salting are Needed

- **Passwords must never be stored in plain text** for security reasons. If the database is compromised, plain text passwords would be exposed, potentially compromising user accounts on other websites (since many users reuse passwords).
- **Hashing:** provides a way to securely store passwords by converting them into a fixed-length string that cannot be reversed.

### What is hashing

- **Hashing** is the process of converting a variable-length input (like a password) into a fixed-size output using mathematical functions, knows as **hash functions**.
- Hashing is **one-way** - meaning it cannot be reverted to get the original input.
- For example, when a user logs in, the password they provide is hashed, and the system compares it to the stored hash in the database.

### How Does Hashing Work in Authentication

1. The user provides a password during sign-up.
2. The password is hashed using a hashing algorithm (e.g. `bcrypt`).
3. The hashed value is saved in the database.
4. When the user logs in, the provided password is hashed again using the same algorithm, and the result is compared to the stored hash.
5. If the hashes match, the user is authenticated.

### What is Salting

- **Salting** adds an additional layer of security by adding a random string (called a "salt") to the password before hashing.
- This ensures that even if two users have the same password, their hashed values will be different due to the unique salt applied to each password.
- **Bcrypt** generates the salt automatically and stores it alongside the hash in a single string.

### Example of a Bcrypt-Generated Hash

A typical bcrypt hash might look like this:

```
$2y$10$EixZaYVK1fsbw1Zfbx3OX.eWoEXJ3pOLe/9P1slvGoFUJGAjy/yKa
```

- `$2y$` indicates the bcrypt algorithm.
- `$10$` : The **cost factor**, representing the number of rounds of hashing. Higher cost factors make the hash more secure but require more computation.
- The next part contains the **salt**.
- The last part is the **hashed value**.

### Why Use Bcrypt

- **Bcrypt** is a hashing algorithm that automatically handles **salting** and ensures strong security by adjusting the cost factor.
- The same bcrypt algorithm is used to compare passwords during login by hashing the provided password and checking it against the stored hash.

### How Bcrypt Works

1. **Hashing a password:** Bcrypt generates a **salt** and hashes the password with that salt. It then produces a final string that contains both the salt and the hashed password.
2. **Comparing a password to a hash:** When a user logs in, Bcrypt takes the provided password, hashes it using the same algorithm and salt, and compares it to the stored hash.

### Key Benefits

- **Irreversibility:** Hashing ensures that even if a hacker gets access to the database, they cannot recover the original passwords.
- **Protection against rainbow table attacks:** Salting adds randomness to passwords, making it more difficult for attackers to use precomputed hash tables (rainbow tables) to guess passwords.
