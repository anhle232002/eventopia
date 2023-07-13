import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { finished } from 'stream/promises';
@Injectable()
export class CloudinaryService {
  private instance: typeof cloudinary;

  constructor(private readonly configService: ConfigService) {
    this.instance = cloudinary;
    this.instance.config({
      api_key: configService.get<string>('CLOUD_API_KEY'),
      api_secret: configService.get<string>('CLOUD_API_SECRET'),
      cloud_name: configService.get<string>('CLOUD_NAME'),
    });
  }

  async uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadImagesPromises = imageFiles.map(
      (file) =>
        new Promise<{ url: string; publicId: string }>((resolve, reject) => {
          const uploadStream = this.instance.uploader.upload_stream(
            {
              folder: '/events',
              use_filename: true,
            },
            (err, result) => {
              if (err) reject(err);
              else {
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                });
              }
            },
          );

          const stream = new Readable();

          stream.push(file.buffer);
          stream.push(null);
          stream.pipe(uploadStream);
        }),
    );

    return await Promise.all(uploadImagesPromises);
  }

  async removeImages(imagesPublicIds: string[]) {
    const removeImagePromises = imagesPublicIds.map((publicId) => {
      return this.instance.uploader.destroy(publicId, {
        resource_type: 'image',
      });
    });

    return await Promise.all(removeImagePromises);
  }

  async uploadFile(buffer: Buffer, folder: string) {
    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      const uploadStream = this.instance.uploader.upload_stream(
        {
          folder: folder,
          use_filename: true,
        },
        (err, result) => {
          if (err) reject(err);
          else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        },
      );

      const stream = new Readable();

      stream.push(buffer);

      stream.push(null);

      stream.pipe(uploadStream);
    });
  }

  async downloadFileAsBuffer(publicId: string, fileName: string) {
    const url = this.instance.url(publicId, { flags: [`attachment:${fileName}`] });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to download file from Cloudinary');
    }

    const arrayBuffer = await response.arrayBuffer();

    return Buffer.from(arrayBuffer);
  }

  async downloadFile(publicId: string, fileName: string) {
    const url = this.instance.image(publicId, { transformation: [{ page: 1 }] });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to download file from Cloudinary');
    }

    const stream = fs.createWriteStream(path.resolve('files', `${fileName}`));
    const body = Readable.fromWeb(response.body as any);

    await finished(body.pipe(stream));

    return fileName;
  }
}
