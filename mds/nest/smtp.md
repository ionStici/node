# Notification Emails

```bash
npm i @nestjs-modules/mailer
npm i nodemailer
npm i ejs
```

```bash
npx nest g module mail --no-spec
npx nest g service mail/providers/mail.service --flat --no-spec
```

```makefile
# .env.development
MAIL_HOST='sandbox.smtp.mailtrap.io'
SMTP_USERNAME='username'
SMTP_PASSWORD='password'
```

```ts
// config/app.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("appConfig", () => ({
  mailHost: process.env.MAIL_HOST,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
}));
```

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

```html
<!-- mail/templates/welcome.ejs -->
<p>Welcome, <%= name %>!</p>
```

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
