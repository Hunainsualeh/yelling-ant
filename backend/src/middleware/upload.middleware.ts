import multer from 'multer';
import path from 'path';

/**
 * Configure multer for image uploads
 * Files are stored in memory for processing before S3/Cloudinary upload
 */
const storage = multer.memoryStorage();

/**
 * File filter - only allow images
 */
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

/**
 * Multer upload configuration
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
    files: parseInt(process.env.MAX_FILES_PER_REQUEST || '10'),
  },
});
