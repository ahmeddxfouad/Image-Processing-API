import fs from 'fs/promises';
import path from 'path';
import processImage, { buildThumbPath, fullImagePath } from '../../utils/imageProcessor';
const FULL_DIR = path.resolve('assets/full');
const THUMBS_DIR = path.resolve('assets/thumbs');

describe('imageProcessor utilities (imageProcessor.ts)', () => {
  beforeAll(async () => {
    await fs.mkdir(FULL_DIR, { recursive: true });
    await fs.mkdir(THUMBS_DIR, { recursive: true });
  });

  it('buildThumbPath() → deterministic name', async () => {
    const p = await buildThumbPath('sample', 123, 456);
    expect(p.endsWith(path.join('assets', 'thumbs', 'sample_w123_h456.jpg'))).toBeTrue();
  });

  it('fullImagePath() → points to .jpg under assets/full', async () => {
    const p = await fullImagePath('unit');
    expect(p.endsWith(path.join('assets', 'full', 'unit.jpg'))).toBeTrue();
  });

  it('processImage() rejects invalid inputs', async () => {
    await expectAsync(processImage('', 100, 100)).toBeRejected();
    await expectAsync(processImage('unit', 0, 100)).toBeRejected();
    await expectAsync(processImage('unit', 100, -5)).toBeRejected();
  });

  it('processImage() creates cached file when source exists (skips if missing)', async () => {
    const srcName = 'fjord'; // change if you use a different file name
    const srcPath = path.join(FULL_DIR, `${srcName}.jpg`);

    try {
      await fs.access(srcPath);
    } catch {
      pending(`Place ${srcPath} to run this unit processing test.`);
      return;
    }

    const outPath = await buildThumbPath(srcName, 111, 99);
    await fs.rm(outPath, { force: true });

    const produced = await processImage(srcName, 111, 99);
    expect(produced).toBe(outPath);

    const exists = await fs
      .access(outPath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBeTrue();

    await fs.rm(outPath, { force: true });
  });
});
