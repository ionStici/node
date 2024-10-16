# Compodoc and JSDoc for Documentation

## Introduction

- [**Compodoc**](https://compodoc.app) is a tool for generating documentation for NestJS applications, covering modules, services, controllers, and more.

- [**JSDoc**](https://jsdoc.app) is used for adding inline comments to improve documentation quality.

## Install Compodoc

```bash
npm i @compodoc/compodoc
```

## Compodoc Configuration

```json
// package.json
{
  "scripts": {
    "doc": "npx @compodoc/compodoc -p tsconfig.json -s --port 3001 --watch -d ./documentation"
  }
}
```

- `npx @compodoc/compodoc` : Executes Compodoc to generate documentation.
- `-p tsconfig.json` : Specifies the path to the TypeScript configuration file.
- `-s` : Instructs Compodoc to serve the documentation.
- `--post 3001` : Defines the port to server the documentation.
- `--watch` : Automatically regenerates documentation when changes are detected.
- `-d ./documentation` : Specifies the output directory for the documentation files.

## Generate Documentation

```bash
npm run doc
```

This command will generate documentation and serve it on `http://localhost:3001`.

## Compodoc Coverage and JSDoc

**Compodoc** generates project documentation, while **JSDoc** provides detailed inline comments to enhance coverage and quality.

```ts
// users/providers/users.service.ts

/**
 * Handles interactions with the Users table and user management operations.
 */
@Injectable()
export class UsersService {
  /**
   * Finds a user by their unique ID.
   * @param userId - The user's unique identifier.
   * @returns User details or throws an exception.
   */
  findUserById(userId: string): User {
    // Implementation
  }
}
```
