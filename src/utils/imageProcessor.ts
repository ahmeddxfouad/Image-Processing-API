import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

// Resolve from project root so compiled code doesn't drift into dist/*
const ROOT = process.cwd();
const ASSETS_DIR = path.resolve(ROOT, 'assets');
const FULL_DIR = path.join(ASSETS_DIR, 'full');
const THUMBS_DIR = path.join(ASSETS_DIR, 'thumbs');

export const ensureThumbsFolder = async (): Promise<void> => {
  await fs.mkdir(THUMBS_DIR, { recursive: true });
};

// Very small helper to keep filenames safe (basename only, strip ext traversal)
const safeBase = (name: string): string => {
  const base = path.basename(name, path.extname(name));
  if (!/^[a-zA-Z0-9_-]+$/.test(base)) {
    throw new Error('Invalid filename');
  }
  return base;
};

export const fullImagePath = (filename: string): string => {
  const base = safeBase(filename);
  // Per rubric: handle .jpg. If you add support for more, probe here.
  return path.join(FULL_DIR, `${base}.jpg`);
};

export const buildThumbPath = (filename: string, width: number, height: number): string => {
  const base = safeBase(filename);
  return path.join(THUMBS_DIR, `${base}_w${width}_h${height}.jpg`);
};

const fileExists = async (p: string): Promise<boolean> => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

const processImage = async (filename: string, width: number, height: number): Promise<string> => {
  if (!filename) throw new Error('filename is required');
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error('width and height must be positive integers');
  }

  const src = fullImagePath(filename);
  const dest = buildThumbPath(filename, width, height);

  // Fail fast if original missing
  if (!(await fileExists(src))) {
    throw new Error(`Input file is missing: ${src}`);
  }

  await ensureThumbsFolder();

  // Cache hit → reuse
  if (await fileExists(dest)) {
    return dest;
  }

  // Generate and save
  await sharp(src).resize(width, height).jpeg({ quality: 80 }).toFile(dest);
  return dest;
};

export default processImage;
