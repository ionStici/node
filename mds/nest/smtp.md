# Notification Emails

## Installing Packages

```bash
npm i @nestjs-modules/mailer
npm i nodemailer
npm i ejs
```

- `@nestjs-modules/mailer` : A NestJS module that provides email sending functionality using various transport mechanisms. It acts as a wrapper around popular Node.js email modules like Nodemailer.
- `nodemailer` : A module for Node.js applications to send emails. It supports various transport methods, including SMTP.
- `ejs` : A simple templating language that lets you generate HTML with plain JavaScript. It's used here for creating dynamic email templates.

## Generating Mail Module and Service

```bash
npx nest g module mail --no-spec
npx nest g service mail/providers/mail.service --flat --no-spec
```

## Environment Variables

```makefile
# .env.development
MAIL_HOST='sandbox.smtp.mailtrap.io'
SMTP_USERNAME='username'
SMTP_PASSWORD='password'
```

- `MAIL_HOST` : The SMTP server host. In this case, Mailtrap's sandbox SMTP server is used for testing.
- `SMTP_USERNAME` & `SMTP_PASSWORD`: Credentials for authenticating with the SMTP server.

Mailtrap is a service that allows you to test email sending in a safe environment without sending real emails to actual users.

```ts
// config/app.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("appConfig", () => ({
  mailHost: process.env.MAIL_HOST,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
}));
```

## Setting Up the Mail Module

```ts
// mail/mail.module.ts
import { Global, Module } from "@nestjs/common";
import { MailService } from "./providers/mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get("appConfig.mailHost"),
          secure: false,
          port: 2525,
          auth: {
            user: config.get("appConfig.smtpUsername"),
            pass: config.get("appConfig.smtpPassword"),
          },
        },
        default: {
          from: `My Blog <no-reply@nestjs-blog.com>`,
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
          }),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
```

1. **Global Module:** The `@Global()` decorator makes the `MailModule` accessible throughout your application without needing to import it in other modules.

2. **MailerModule Configuration:**

   - `MailerModule.forRootAsync` : Allows asynchronous configuration, useful when you need to inject dependencies like `ConfigService`.
   - `inject: [ConfigService]` : Injects `ConfigService` into the factory function.
   - **Factory Function:** Returns an object that configures the mailer.

3. **Transport Configuration:**

   - `host` : SMTP server host obtained from environment variables.
   - `secure` : Set to `false` because Mailtrap does not use SSL/TLS in the sandbox environment.
   - `port` : Mailtrap's SMTP port (`2525`).
   - `auth` : Credentials for SMTP authentication.

4. **Default Email Options:**

   - `from` : Default sender email address for all outgoing emails.

5. **Template Configuration:**

   - `dir` : Directory where email templates are stored (`mail/templates`).
   - `adapter` : Uses `EjsAdapter` to render EJS templates.
   - `options` : Additional options for the EJS adapter.

6. **Providers and Exports:**

   - `providers: [MailService]` : Registers the `MailService` so it can be injected elsewhere.
   - `exports: [MailService]` : Makes the `MailService` available for import in other modules.

## Implementing the Mail Service

```ts
// main/providers/main.service.ts
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "src/users/user.entity";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: `OnBoarding Team <support@nestjs-blog.com>`,
      subject: "Welcome to NestJs Blog",
      template: "./welcome",
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: "http://localhost:3000",
      },
    });
  }
}
```

- **Injecting MailerService:** The `MailerService` from `@nestjs-modules/mailer` is injected into the `MailService`.

- **`sendUserWelcome` Method:**
  - **Purpose:** Sends a welcome email to a new user.
  - **Parameters:** Accepts a `User` object containing user details.
  - `mailerService.sendMail`:
    - `to`: Recipient's email address (`user.email`).
    - `from`: Sender's email address, which can override the default.
    - `subject`: Email subject line.
    - `template`: Path to the EJS email template relative to the templates directory.
    - `context`: Data passed to the template for dynamic content.
- **Template Variables:** The `context` object properties (`name`, `email`, `loginUrl`) are used in the EJS template to personalize the email.

## Configuring Email Templates

To ensure that your email templates are included in the build process and available at runtime, you need to update `nest-cli.json`:

```json
// nest-cli.json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "assets": [
      {
        "include": "./mail/templates",
        "outDir": "dist/",
        "watchAssets": true
      }
    ]
  }
}
```

- `compilerOptions.assets`: Specifies that the `mail/templates` directory should be copied to the `dist/` folder during the build process.
- `watchAssets: true`: Ensures that changes to the templates trigger a rebuild during development.

## Creating the Email Template

```html
<!-- mail/templates/welcome.ejs -->
<p>Welcome, <%= name %>!</p>
```

- **EJS Syntax:** `<%= name %>` outputs the `name` variable passed in the `context` object.
- **Purpose:** This simple template generates a personalized welcome message for the user.

## Sending Emails Upon User Registration

```ts
// users/providers/create-user.provider.ts
import { MailService } from "src/mail/providers/mail.service";

@Injectable()
export class CreateUserProvider {
  constructor(private readonly mailService: MailService) {}

  public async createUser(createUserDto: CreateUserDto) {
    // ...

    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    // ...

    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
```

- **MailService Injection:** The `MailService` is injected into the `CreateUserProvider`, allowing it to send emails.

- **After User Creation:**

  - Once a new user is successfully created and saved to the database, the `sendUserWelcome` method is called to send a welcome email.
  - **Error Handling:** The email sending operation is wrapped in a `try-catch` block to handle any exceptions that may occur, such as network issues or SMTP errors.
