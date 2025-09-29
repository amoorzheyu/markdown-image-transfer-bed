import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const IMAGES_DIR = path.join(__dirname, 'images');
const API_KEY = process.env.API_KEY || '';
const BASE_URL = process.env.BASE_URL || '';

if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use('/images', express.static(IMAGES_DIR));
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

// API Key 验证
function maybeAuth(req, res, next) {
  if (!API_KEY) return next();
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// 上传文件
app.post('/upload', maybeAuth, async (req, res) => {
  try {
    if (!req.body || !req.body.length) return res.status(400).json({ error: 'No file uploaded' });

    const buffer = req.body;
    const ext = req.query.ext || '.png';
    const filename = `${Date.now()}-${uuidv4()}${ext.startsWith('.') ? ext : '.' + ext}`;
    const outPath = path.join(IMAGES_DIR, filename);

    await fs.promises.writeFile(outPath, buffer);
    const base = BASE_URL || `${req.protocol}://${req.get('host')}`;
    const url = `${base}/images/${filename}`;

    return res.json({ success: true, url, filename, localPath: `images/${filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Simple Image Host running on port ${PORT}`);
  console.log(`Images dir: ${IMAGES_DIR}`);
});
