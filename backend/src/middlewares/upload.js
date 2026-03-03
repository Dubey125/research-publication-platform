import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const absoluteUploadDir = path.join(process.cwd(), uploadDir);

if (!fs.existsSync(absoluteUploadDir)) {
  fs.mkdirSync(absoluteUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, absoluteUploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    cb(new Error('Only PDF files are allowed.'));
  } else {
    cb(null, true);
  }
};

const maxFileSize = (Number(process.env.MAX_FILE_SIZE_MB) || 15) * 1024 * 1024;

export const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSize }
});

const imageFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files are allowed.'));
  } else {
    cb(null, true);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
