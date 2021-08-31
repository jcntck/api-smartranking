import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  constructor(private readonly configService: ConfigService) {}

  uploadArquivo(file: any, id: string): Promise<any> {
    const s3 = new AWS.S3({
      region: this.configService.get<string>('AWS_REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });

    const filename = `${id}.${file.originalname.split('.')[1]}`;

    return s3
      .putObject({
        Body: file.buffer,
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: filename,
      })
      .promise()
      .then(
        () => {
          return {
            url: `https://jcntck-smartranking.s3.sa-east-1.amazonaws.com/${filename}`,
          };
        },
        (err) => {
          this.logger.error(err);
          return err;
        },
      );
  }
}
