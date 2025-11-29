import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import processImage, {
  buildThumbPath,
  fullImagePath,
  ensureThumbsFolder,
} from '../utils/imageProcessor.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { filename, width, height } = req.query;
    console.log('file name path is :' + filename);
    if (!filename) {
      return res.status(400).json({ error: 'Missing filename parameter' });
    }
    if (!width || !height) {
      return res.status(400).json({ error: 'Missing width or height parameter' });
    }

    const w = Number(width);
    const h = Number(height);

    if (!Number.isInteger(w) || !Number.isInteger(h)) {
      return res.status(400).json({ error: 'Width and height must be integers' });
    }
    if (w <= 0 || h <= 0) {
      return res.status(400).json({ error: 'Width and height must be positive' });
    }

    const fullPath = await fullImagePath(String(filename));
    try {
      await fs.access(fullPath);
    } catch {
      return res.status(404).json({ error: `Image '${filename}' not found in assets/full` });
    }

    await ensureThumbsFolder();

    const thumbPath = await buildThumbPath(String(filename), w, h);

    try {
      await fs.access(thumbPath);
      return res.sendFile(thumbPath);
    } catch {
      // not cached
    }

    await processImage(String(filename), w, h);
    return res.sendFile(thumbPath);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: 'Internal server error', detail: message });
  }
});

export default router;
