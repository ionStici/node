# Validating Environment Variables

## Install Joi

`Joi` - package to handle schema-based validation for environment variables.

```bash
npm i joi
```

## Define the Validation Schema

_Create a schema to validate the required environment variables:_

```ts
// src/config/environment.validation.ts
import * as Joi from "joi";

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production", "staging")
    .default("development"),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  PROFILE_API_KEY: Joi.string().required(),
});
```

- **NODE_ENV:** Must be one of `development`, `test`, `production`, or `staging`. If not provided, it defaults to `development`.
- **DATABASE_PORT:** Must be a valid port number, defaulting to `5432`.
- **`DATABASE_` and `PROFILE_API_KEY`:** These are required strings, ensuring that critical database and API configurations are always provided.

## Integrate Validation with ConfigModule

`{ validationSchema: environmentValidation }` applies the validation schema.

```ts
import environmentValidation from "./config/environment.validation";
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: environmentValidation,
    }),
  ],
})
export class AppModule {}
```

**Validation and Bootstrap:** When the application starts, the environment variables are validated against the schema. If any required variable is missing or invalid, the application will fail to start and display a clear error message.
