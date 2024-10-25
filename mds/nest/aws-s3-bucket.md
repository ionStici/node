# File Uploads using AWS S3 Bucket & Cloudfront

## Setup S3 and Cloudfront

**S3** -> Make sure the region is the intended one -> Create bucket (make it public) -> Go to newly created bucket -> Permissions -> Bucket policy -> Edit -> Policy generator -> Fill out the form as follows: S3 Bucket Policy + Allow + Principal: `*` + Actions: `GetObject` + ARN: `<bucket-arn>/*` -> Add Statement and Generate Policy -> Copy the generated code and paste it in the Bucket policy box then Save changes.

**IAM** -> Users -> Create user -> Attach policies directly: AmazonS3FullAccess + IAMUserSSHKeys + IAMFullAccess -> Next and Create user -> Go to user page and click "Create access key" -> Choose "Local code" then click Next -> Copy the "Access Key" and "Secret access key" for future use.

**CloudFront** -> Create distribution -> Choose the created S3 bucket as the Origin domain -> After creating the distribution, copy the "Distribution domain name".

## Initial Configuration

### Installs and Modules

```bash
npm i aws-sdk # AWS SDK for JavaScript, enables interaction with AWS services
npm i -D @types/multer # Type definitions for Multer (used for handling multipart/form-data)
npm i uuid # For generating unique identifiers for files
```

```bash
# Generate NestJS modules, controllers, services, providers
npx nest g module uploads --no-spec
npx nest g controller uploads --no-spec
npx nest g service uploads/providers/uploads --flat --no-spec
npx nest g pr /uploads/providers/upload-to-aws.provider --flat --no-spec
```

### Environment Variables

```makefile
# .env.development # Set up AWS credentials and configurations
AWS_PUBLIC_BUCKET_NAME='bucket-name'    # Your S3 bucket name
AWS_REGION='region'                     # AWS region where your bucket is located
AWS_CLOUDFRONT_URL='distribution-url'   # CloudFront URL for faster content delivery
AWS_ACCESS_KEY_ID='iam-access-key'      # Your AWS access key ID
AWS_SECRET_ACCESS_KEY='iam-secret-key'  # Your AWS secret access key
```

### Application Configuration

Register the AWS-related environment variables in the NestJS configuration:

```ts
// config/app.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("appConfig", () => ({
  awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  awsCloudfrontUrl: process.env.AWS_CLOUDFRONT_URL,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}));
```

### AWS SDK Setup in Main File

Configure AWS SDK globally:

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "aws-sdk";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ...

  // Retrieve AWS credentials and region from ConfigService
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get("appConfig.awsAccessKeyId"),
      secretAccessKey: configService.get("appConfig.awsSecretAccessKey"),
    },
    region: configService.get("appConfig.awsRegion"),
  });

  await app.listen(3000);
}
bootstrap();
```

**Purpose:** This sets up the AWS SDK with your credentials and region, so you can use AWS services (like S3) anywhere in your application without reconfiguring.

## Upload Entity and Module

### Upload Entity for Files

```ts
export enum fileTypes {
  IMAGE = "image",
}

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 1024,
    nullable: false,
  })
  name: string; // The filename stored in S3

  @Column({
    type: "varchar",
    length: 1024,
    nullable: false,
  })
  path: string; // The URL to access the file (e.g., CloudFront URL)

  @Column({
    type: "enum",
    enum: fileTypes,
    default: fileTypes.IMAGE,
    nullable: false,
  })
  type: string; // The type of file (e.g., image)

  @Column({
    type: "varchar",
    length: 128,
    nullable: false,
  })
  mime: string; // MIME type of the file

  @Column({
    type: "varchar",
    length: 1024,
    nullable: false,
  })
  size: number; // Size of the file in bytes

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
```

### Uploads Module

```ts
import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./providers/uploads.service";
import { Upload } from "./upload.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadToAwsProvider } from "./providers/upload-to-aws.provider";

@Module({
  imports: [TypeOrmModule.forFeature([Upload])],
  controllers: [UploadsController],
  providers: [UploadsService, UploadToAwsProvider],
})
export class UploadsModule {}
```

**Purpose:** Registers the controller, service, and provider, and imports the Upload entity for database interactions.

## Controller and Providers

### Uploads Controller

```ts
// uploads/uploads.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiHeaders, ApiOperation } from "@nestjs/swagger";
import { Express } from "express";
import { UploadsService } from "./providers/uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @ApiHeaders([
    { name: "Content-Type", description: "multipart/form-data" },
    { name: "Authorization", description: "Bearer Token" },
  ])
  @ApiOperation({ summary: "Upload a new image to the server" })
  @UseInterceptors(FileInterceptor("file")) // Intercepts file uploads
  @Post("file")
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file); // Delegates to the service
  }
}
```

**Purpose:** Handles HTTP POST requests to upload files and uses `FileInterceptor` to handle multipart/form-data.

### Uploads Service

```ts
// uploads/providers/uploads.service.ts
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { UploadToAwsProvider } from "./upload-to-aws.provider";
import { InjectRepository } from "@nestjs/typeorm";
import { Upload } from "../upload.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { fileTypes } from "../enums/file-types.enum";

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadToAwsProvider: UploadToAwsProvider,

    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    private readonly configService: ConfigService
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    // throw error for unsupported MIME types
    if (!["image/gif", "image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
      throw new BadRequestException("Mime type not supported");
    }

    try {
      // Upload to AWS S3
      const fileName = await this.uploadToAwsProvider.fileUpload(file);

      // Construct the file URL using CloudFront URL and the file name
      const fileUrl = `${this.configService.get("appConfig.awsCloudfrontUrl")}/${fileName}`;

      // Prepare file data to be saved in the database
      const uploadedFile: Upload = this.uploadRepository({
        name: fileName,
        path: fileUrl,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      });

      // Save file record in the database
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
```

- Validates the file's MIME type to ensure only supported image formats are uploaded.
- Calls `UploadToAwsProvider` to upload the file to AWS S3.
- Constructs the file URL using the CloudFront distribution.
- Saves file metadata in the database for future reference.

## Upload to AWS Provider

```ts
// uploads/providers/upload-to-aws.provider.ts
import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
import * as path from "path";
import { v4 as uuid4 } from "uuid";

@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}

  public async fileUpload(file: Express.Multer.File) {
    const s3 = new S3();

    try {
      // Prepare S3 upload parameters
      const uploadParams = {
        Bucket: this.configService.get("appConfig.awsBucketName"), // S3 bucket name
        Body: file.buffer, // File buffer
        Key: this.generateFileName(file), // Unique file name
        ContentType: file.mimetype, // MIME type
      };

      // Upload file to S3
      const uploadResult = await s3.upload(uploadParams).promise();

      // Return the file key (used to construct the URL)
      return uploadResult.Key;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    // Extract the base name without extension
    const baseName = path.parse(file.originalname).name.replace(/\s+/g, "").trim();

    // Extract the file extension
    const extension = path.extname(file.originalname);

    // Generate a unique identifier
    const uniqueId = uuidv4();

    // Generate a timestamp
    const timestamp = Date.now();

    // Combine to form a unique file name
    return `${baseName}-${timestamp}-${uniqueId}${extension}`;

    // // Extract file name
    // const name = file.originalname.split(".")[0];

    // // Remove white spaces
    // name.replace(/\s/g, "").trim();

    // // Extract the extension
    // const extension = path.extname(file.originalname);

    // // Generate time stamp
    // const timestamp = new Date().getTime().toString().trim();

    // // Return file uuid
    // return `${name}-${timestamp}-${uuid4()}${extension}`;
  }
}
```

- **S3 Instance:** Creates an instance of AWS S3 client to interact with S3 service.
- **fileUpload Method:** Handles the actual file upload to S3.
  - **Bucket:** Specifies which S3 bucket to upload to, retrieved from environment variables via `ConfigService`.
  - **Body:** The file data buffer.
  - **Key:** A unique file name generated by `generateFileName`, ensuring no collisions in S3.
  - **ContentType:** The MIME type of the file, important for correct handling and display.
- **generateFileName Method:**
  - Generates a unique file name using the original file name (sanitized), a timestamp, and a UUID.
  - This unique name prevents overwriting files in S3 and helps in file organization.
- **Error Handling:** If the upload fails, throws a `RequestTimeoutException`.

## Testing the File Upload

```makefile
POST http://localhost:3000/uploads/file
Content-Type: multipart/form-data; boundary=WebkitFormBoundary
Authorization: Bearer <token>

file
--WebkitFormBoundary
Content-Disposition: form-data; name="file"; filename="test.jpg"
Content-Type: image/jpg

< ./test.jpg
--WebkitFormBoundary--
```

## How It All Works Together

1. **Client Request:** A client sends a POST request to `/uploads/file` with a file attached.
2. **Controller Handling:**
   - The `UploadsController` receives the request.
   - Uses `FileInterceptor` to handle the file upload.
3. **Service Processing:**
   - `UploadsService` validates the file type.
   - Calls `UploadToAwsProvider.fileUpload()` to upload the file to S3.
4. **Uploading to AWS S3:**
   - `UploadToAwsProvider` prepares the upload parameters, including a unique file name.
   - Uses AWS SDK's `s3.upload()` method to upload the file to the specified S3 bucket.
5. **Saving Metadata:**
   - Once uploaded, the file's key (unique name in S3) is returned.
   - `UploadsService` constructs the file's URL using the CloudFront URL and the file key.
   - Saves the file metadata (name, path, type, MIME type, size) in the database.
6. **Response:**
   - The saved file metadata is returned as the response to the client.
   - The client can use the `path` (URL) to access the uploaded file.
