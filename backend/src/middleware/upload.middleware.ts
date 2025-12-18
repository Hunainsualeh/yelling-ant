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

// Alt-text enforcement helper: expects `alt_texts` as JSON array in body matching files order
export function requireAltText(req: any, res: any, next: any) {
  const files = req.files || [];
  if (files.length === 0) return next();

  const altTextsRaw = req.body.alt_texts || req.body.altTexts || null;
  if (!altTextsRaw) {
    return res.status(400).json({ error: 'Alt text required for uploaded images', details: 'Provide alt_texts as JSON array in request body' });
  }

  let altTexts: string[] = [];
  try {
    altTexts = typeof altTextsRaw === 'string' ? JSON.parse(altTextsRaw) : altTextsRaw;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid alt_texts JSON' });
  }

  if (!Array.isArray(altTexts) || altTexts.length < files.length) {
    return res.status(400).json({ error: 'alt_texts must be an array with one entry per uploaded file' });
  }

  // attach alt_texts to request for controller use
  req.alt_texts = altTexts;
  next();
}
