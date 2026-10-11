import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { fileURLToPath } from 'node:url';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
const here = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(here, '../../uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });
const extensions = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' };
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => callback(null, `${randomUUID()}${extensions[file.mimetype] || ''}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 2 },
  fileFilter: (_req, file, callback) => {
    if (!extensions[file.mimetype]) return callback(new Error('Upload a JPG, PNG, GIF, or WebP image.'));
    callback(null, true);
  }
});

router.post('/', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Choose an image to upload.' });
  res.status(201).json({ filename: req.file.filename, url: `/uploads/${req.file.filename}`, size: req.file.size, contentType: req.file.mimetype });
});
export default router;
