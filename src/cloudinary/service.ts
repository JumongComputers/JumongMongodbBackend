import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

import type { Express } from 'express';

@Injectable()
export class CloudinaryService {
  /* =======================
     SINGLE IMAGE UPLOAD
  ======================= */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new InternalServerErrorException('No file uploaded');
      }

      // ✅ optional validation
      if (!file.mimetype.startsWith('image/')) {
        throw new InternalServerErrorException(
          'Only image uploads are allowed',
        );
      }

      const result = await this.uploadToCloudinary(file);
      console.log("Uploading:", file.originalname);

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);

      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  /* =======================
     MULTIPLE IMAGE UPLOADS
  ======================= */
  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    if (!files?.length) return [];

    return Promise.all(files.map((file) => this.uploadImage(file)));
  }

  /* =======================
     PRIVATE HELPER
  ======================= */
  private uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'products',

          // ✅ optimization
          resource_type: 'image',

          // ✅ better naming
          use_filename: true,
          unique_filename: true,

          // ✅ optional transformations
          transformation: [
            {
              quality: 'auto',
              fetch_format: 'auto',
            },
          ],
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result) {
            return reject(new Error('Cloudinary upload failed'));
          }

          resolve(result);
        },
      );

      // ✅ safer stream handling
      Readable.from(file.buffer).pipe(upload);
    });
  }
}
