import { S3EnvVariables } from '@/configs/s3.config';
import { Seconds } from '@/types/branded.type';
import { generateFileName } from '@/utils/generate-file-name';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private logger: Logger = new Logger(S3Service.name);

  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService<S3EnvVariables>) {
    this.s3Client = new S3Client({
      region: this.configService.get('S3_REGION', { infer: true }),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY', { infer: true }),
        secretAccessKey: this.configService.get('S3_SECRET_KEY', {
          infer: true,
        }),
      },
    });

    this.bucketName = this.configService.get('S3_BUCKET_NAME', { infer: true });
  }

  async uploadFile({ buffer, mimetype }: Express.Multer.File): Promise<string> {
    const fileName = generateFileName();

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: mimetype,
    });

    await this.s3Client.send(command);
    return fileName;
  }

  async getFileUrl(
    fileName: string,
    expiresIn = (24 * 60 * 60) as Seconds,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      }),
    );
  }
}
