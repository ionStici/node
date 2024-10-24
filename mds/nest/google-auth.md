# Google Authentication

## Configure Google Project

- [Google Console](https://console.cloud.google.com) -> Create New Project -> Go to APIs & Services within the project -> OAuth consent screen -> Choose External and Click Create -> Fill out the App information -> Add Scopes then Save and Continue -> Add a Test user then Save.

- Credentials -> Create Credentials -> Choose OAuth client ID -> Choose "Web application" as App Type, and add the Authorized JavaScript origins -> Copy the **"Client ID"** and **"Client secret"**.

## Environment Variables

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

## Installing Google Auth Library

```bash
npm i google-auth-library
```

`google-auth-library` : Official Google authentication library for Node.js, which provides helper methods for working with Google authentication flows.

## Generating Necessary Files

```bash
npx nest g co auth/social/google-authentication --flat --no-spec
npx nest g s auth/social/providers/google-authentication --flat --no-spec
npx nest g pr /users/providers/find-one-by-google-id.provider --flat --no-spec
npx nest g pr /users/providers/create-google-user.provider --flat --no-spec
```

## Enabling CORS in Main File

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enable Cross-Origin Resource Sharing

  await app.listen(3000);
}
bootstrap();
```

- **Purpose:** Enables CORS to allow requests from different origins, which is necessary when your frontend and backend are hosted on different domains or ports.
- **Importance for Google Authentication:** The frontend will send requests to the backend with Google tokens, so CORS needs to be enabled to prevent cross-origin request errors.

## Google Authentication Controller

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

- `@Auth(AuthType.None)` : Custom decorator to specify that this route does not require authentication.

- `@Controller("auth/google")` : Sets the base route for this controller to `/auth/google`.

- `authenticate` Method : Handles POST requests to `/auth/google` with a Google token in the body, which then delegates the authentication process to `GoogleAuthenticationService`.

## Google Authentication Service

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

- `OAuth2Client` : An instance of Google's OAuth 2.0 client used to verify ID tokens.

- `OnModuleInit` : Lifecycle hook that initializes `oauthClient` after the module is instantiated.

- `authenticate` Method: Verifies the Google ID token and handles user authentication. Steps:

  1. **Verify the Token:** Uses `oauthClient.verifyToken` to validate the ID token received from the client. If the token is invalid or expired, an error is thrown.
  2. **Extract User Information:** `loginTicket.getPayload()` Retrieves the user's email, Google ID (`sub`), first name, and last name from the token payload.
  3. **Check for Existing User:** If user exists, generate JWT tokens and return them. If user does not exist, create a new user in the database using the extracted information, then generate and return JWT tokens.
  4. **Error Handling:** Any exceptions during the process result in an `UnauthorizedException`.

## Create Google User Provider

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

This provider handles the creation of a new user in the database using information from Google.

## Frontend Integration

```bash
npm i @react-oauth/google
```

`@react-oauth/google` : A React library that provides components for integrating Google OAuth into your frontend application.

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

- `GoogleOAuthProvider` : Wraps your application and provides Google OAuth context.
- `clientId`: Your Google OAuth client ID.
- `GoogleLogin` Component: Renders a Google Sign-In button.
- `onSuccess`: Called when the user successfully logs in with Google.
  - Receives a `credentialResponse` containing the ID token (`credential` field).
  - Sends a `POST` request to your backend `/auth/google` endpoint with the ID token.
- `onError`: Called if the login fails.

### Process Flow

1. **User Interaction:** User clicks the Google Sign-In button. Completes the authentication flow with Google.
2. **Token Reception:** The `GoogleLogin` component receives an ID token (`credential`) from Google.
3. **Backend Communication:** The frontend sends the ID token to your NestJS backend endpoint (`/auth/google`) via a `POST` request.
4. **Backend Verification:** The backend verifies the ID token using `oauthClient.verifyIdToken`. If valid, proceeds to authenticate or register the user, and returns JWT tokens.
