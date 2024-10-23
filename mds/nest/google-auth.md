# Google Authentication

## Configure Google Project

- [Google Console](https://console.cloud.google.com) -> Create New Project -> Go to APIs & Services within the project -> OAuth consent screen -> Choose External and Click Create -> Fill out the App information -> Add Scopes then Save and Continue -> Add a Test user then Save.

- Credentials -> Create Credentials -> Choose OAuth client ID -> Choose "Web application" as App Type, and add the Authorized JavaScript origins -> Copy the **"Client ID"** and **"Client secret"**.

## Setup

```makefile
# .env.development
GOOGLE_CLIENT_ID="client"
GOOGLE_CLIENT_SECRET="secret"
```

```ts
// src/auth/config/jwt.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => {
  return {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
});
```

```bash
npm i google-auth-library
```

```bash
npx nest g co auth/social/google-authentication --flat --no-spec
npx nest g s auth/social/providers/google-authentication --flat --no-spec
npx nest g pr /users/providers/find-one-by-google-id.provider --flat --no-spec
npx nest g pr /users/providers/create-google-user.provider --flat --no-spec
```

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enable Cors

  await app.listen(3000);
}
bootstrap();
```

```ts
// auth/social/google-authentication.controller.ts
import { Body, Controller, Post } from "@nestjs/common";
import { GoogleAuthenticationService } from "./providers/google-authentication.service";
import { GoogleTokenDto } from "./dtos/google-token.dto";
import { AuthType } from "../enums/auth-type.enum";
import { Auth } from "../decorators/auth.decorator";

@Auth(AuthType.None)
@Controller("auth/google")
export class GoogleAuthenticationController {
  constructor(private readonly googleAuthenticationService: GoogleAuthenticationService) {}

  @Post()
  public authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
```

```ts
// auth/social/providers/google-authentication.service.ts
import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import jwtConfig from "src/auth/config/jwt.config";
import { GoogleTokenDto } from "../dtos/google-token.dto";
import { UsersService } from "src/users/providers/users.service";
import { GenerateTokensProvider } from "src/auth/providers/generate-tokens.provider";

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly generateTokensProvider: GenerateTokensProvider
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // verify the Google Token sent by User
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      // Extract the payload from Google JWT
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();

      // Find the user in the database using the GoogleId
      const user = await this.usersService.findOneByGoogleId(googleId);

      // If googleId exists generate token
      if (user) return this.generateTokensProvider.generateTokens(user);

      // If not create a new user and then generate tokens
      const newUser = await this.usersService.createGoogleUser({
        email,
        firstName,
        lastName,
        googleId,
      });
      return this.generateTokensProvider.generateTokens(newUser);
    } catch (error) {
      // throw Unauthorized exception
      throw new UnauthorizedException(error);
    }
  }
}
```

```ts
// users/providers/create-google-user.provider.ts
import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { GoogleUser } from "../interfaces/google-user.interface";

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      const user = this.userRepository.create(googleUser);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: "Could Not Create A New User",
      });
    }
  }
}
```

## Frontend

```bash
npm i @react-oauth/google
```

```jsx
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  return (
    <GoogleOAuthProvider clientId="google-client-id">
      <GoogleLogin
        buttonText="Login"
        onSuccess={(response) => {
          console.log(response);
          fetch("http://localhost:3000/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.credential }),
          })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }}
      />
    </GoogleOAuthProvider>
  );
}
```
