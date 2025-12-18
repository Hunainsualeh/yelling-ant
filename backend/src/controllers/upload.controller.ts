import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Use local storage for development/testing
const USE_LOCAL_STORAGE = !process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your_aws_access_key_here';

/**
 * Upload image controller
 * Handles compression, WebP conversion, and local/S3 upload
 */
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        error: 'No files uploaded',
      });
      return;
    }

    const uploadPromises = files.map(async (file) => {
      // Process image with sharp
      const isGif = file.mimetype === 'image/gif';

      // If GIF, extract first frame to use as preview and convert to webp; keep original GIF uploaded too
      let processedImage: Buffer;
      if (isGif) {
        // Extract first frame
        processedImage = await sharp(file.buffer, { pages: 1 })
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
      } else {
        processedImage = await sharp(file.buffer)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toBuffer();
      }

      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

      if (USE_LOCAL_STORAGE) {
        // Local storage for testing
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, processedImage);

        return {
          originalName: file.originalname,
          filename,
          url: `http://localhost:${process.env.PORT || 5000}/uploads/${filename}`,
          cdnUrl: `http://localhost:${process.env.PORT || 5000}/uploads/${filename}`,
          size: processedImage.length,
          mimeType: 'image/webp',
          alt_text: (req as any).alt_texts ? (req as any).alt_texts[idx] : null,
        };
      } else {
        // S3 upload (when AWS credentials are configured)
        const AWS = require('aws-sdk');
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION || 'us-east-1',
        });

        const key = `quizzes/${filename}`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET || '',
          Key: key,
          Body: processedImage,
          ContentType: 'image/webp',
          ACL: 'public-read',
        };

        const s3Result = await s3.upload(uploadParams).promise();

        return {
          originalName: file.originalname,
          filename,
          url: s3Result.Location,
          cdnUrl: `${process.env.CDN_URL}/${key}`,
          size: processedImage.length,
          mimeType: 'image/webp',
          alt_text: (req as any).alt_texts ? (req as any).alt_texts[idx] : null,
        };
      }
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.json({
      message: 'Images uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};
