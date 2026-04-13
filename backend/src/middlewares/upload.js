import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const absoluteUploadDir = path.join(process.cwd(), uploadDir);

if (!fs.existsSync(absoluteUploadDir)) {
  fs.mkdirSync(absoluteUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, absoluteUploadDir),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = extension === '.pdf';

  if (!isPdfMime || !isPdfExt) {
    cb(new Error('Only PDF files are allowed.'));
  } else {
    cb(null, true);
  }
};

const maxPdfFileSize = (Number(process.env.MAX_FILE_SIZE_MB) || 15) * 1024 * 1024;
const maxManuscriptFileSize = (Number(process.env.MAX_MANUSCRIPT_FILE_SIZE_MB) || 20) * 1024 * 1024;

export const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxPdfFileSize }
});

const manuscriptFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const allowedTypes = new Map([
    ['application/pdf', '.pdf'],
    ['application/msword', '.doc'],
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx']
  ]);

  const expectedExtension = allowedTypes.get(file.mimetype);
  if (!expectedExtension || extension !== expectedExtension) {
    cb(new Error('Only PDF, DOC, or DOCX files are allowed.'));
  } else {
    cb(null, true);
  }
};

export const uploadManuscript = multer({
  storage,
  fileFilter: manuscriptFilter,
  limits: { fileSize: maxManuscriptFileSize }
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ijtse_images',
    all_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif']
  }
});

const imageFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const allowedImageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
  if (!file.mimetype.startsWith('image/') || !allowedImageExtensions.has(extension)) {
    cb(new Error('Only image files are allowed.'));
  } else {
    cb(null, true);
  }
};

export const uploadImage = multer({
  storage: cloudinaryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadReviewerPhoto = multer({
  storage: cloudinaryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 1 * 1024 * 1024 } // 1 MB limit
});
