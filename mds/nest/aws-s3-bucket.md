# File Uploads using AWS S3 Bucket & Cloudfront

## Setup S3 and Cloudfront

**S3** -> Make sure the region is the intended one -> Create bucket (make it public) -> Go to newly created bucket -> Permissions -> Bucket policy -> Edit -> Policy generator -> Fill out the form as follows: S3 Bucket Policy + Allow + Principal: `*` + Actions: `GetObject` + ARN: `<bucket-arn>/*` -> Add Statement and Generate Policy -> Copy the generated code and paste it in the Bucket policy box then Save changes

**IAM** -> Users -> Create user -> Attach policies directly: AmazonS3FullAccess + IAMUserSSHKeys + IAMFullAccess -> Next and Create user -> Go to user page and click "Create access key" -> Choose "Local code" then click Next -> Copy the "Access Key" and "Secret access key"

**CloudFront**

```makefile
AWS_PUBLIC_BUCKET_NAME='nest-blog-images-test'
AWS_REGION='eu-central-1'
AWS_CLOUDFRONT_URL='https://d2lev2ck6d9o77.cloudfront.net'
AWS_ACCESS_KEY_ID='AKIA3M7AC4HIRB2X6DCL'
AWS_SECRET_ACCESS_KEY='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'
```

## Initial Configuration

```bash
npm i aws-sdk
npm i -D @types/multer
npm i uuid
```

```bash
npx nest g module uploads --no-spec
npx nest g controller uploads --no-spec
npx nest g service uploads/providers/uploads --flat --no-spec
npx nest g pr /uploads/providers/upload-to-aws.provider --flat --no-spec
```

```makefile
# .env.development
AWS_PUBLIC_BUCKET_NAME='bucket-name'
AWS_REGION='eu-central-1'
AWS_CLOUDFRONT_URL='https://example.cloudfront.net'
AWS_ACCESS_KEY_ID='KEY'
AWS_SECRET_ACCESS_KEY='KEY'
```

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

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "aws-sdk";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ...

  // Setup aws sdk & uploading files to aws s3 bucket
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

## Upload Entity and Upload Module

```ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { fileTypes } from "./enums/file-types.enum";

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
  name: string;

  @Column({
    type: "varchar",
    length: 1024,
    nullable: false,
  })
  path: string;

  @Column({
    type: "enum",
    enum: fileTypes,
    default: fileTypes.IMAGE,
    nullable: false,
  })
  type: string;

  @Column({
    type: "varchar",
    length: 128,
    nullable: false,
  })
  mime: string;

  @Column({
    type: "varchar",
    length: 1024,
    nullable: false,
  })
  size: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
```

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

## Controller and Providers

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
  @UseInterceptors(FileInterceptor("file"))
  @Post("file")
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file);
  }
}
```

```ts
// uploads/providers/uploads.service.ts
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { UploadToAwsProvider } from "./upload-to-aws.provider";
import { InjectRepository } from "@nestjs/typeorm";
import { Upload } from "../upload.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { UploadFile } from "../interfaces/upload-file.interface";
import { fileTypes } from "../enums/file-types.enum";

import { fileTypes } from "../enums/file-types.enum";

export interface UploadFile {
  name: string;
  path: string;
  type: fileTypes;
  mime: string;
  size: number;
}

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
      // Upload file to AWS S3 & Get URL to file
      const name = await this.uploadToAwsProvider.fileUpload(file);

      // Generate a new entry in the database
      const uploadedFile: UploadFile = {
        name: name,
        path: `${this.configService.get("appConfig.awsCloudfrontUrl")}/${name}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadRepository.create(uploadedFile);

      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
```

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
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get("appConfig.awsBucketName"),
          Body: file.buffer,
          Key: this.generateFileName(file),
          ContentType: file.mimetype,
        })
        .promise();

      return uploadResult.Key;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    // Extract file name
    const name = file.originalname.split(".")[0];

    // Remove white spaces
    name.replace(/\s/g, "").trim();

    // Extract the extension
    const extension = path.extname(file.originalname);

    // Generate time stamp
    const timestamp = new Date().getTime().toString().trim();

    // Return file uuid
    return `${name}-${timestamp}-${uuid4()}${extension}`;
  }
}
```

## Testing

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
