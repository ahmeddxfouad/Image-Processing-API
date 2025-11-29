import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import app from '../../index';

const FULL_DIR = path.resolve('assets/full');
const THUMBS_DIR = path.resolve('assets/thumbs');
const TEST_NAME = 'fjord'; // change if you use a different file name
const FULL_JPG = path.join(FULL_DIR, `${TEST_NAME}.jpg`);
const WIDTH = 200;
const HEIGHT = 200;
const CACHED = path.join(THUMBS_DIR, `${TEST_NAME}_w${WIDTH}_h${HEIGHT}.jpg`);

describe('Images API (images.ts)', () => {
  beforeAll(async () => {
    await fs.mkdir(FULL_DIR, { recursive: true });
    await fs.mkdir(THUMBS_DIR, { recursive: true });
  });

  it('400 when missing parameters', async () => {
    const res = await request(app).get('/api/images');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('400 when width/height invalid', async () => {
    const res = await request(app).get('/api/images?filename=fjord&width=abc&height=-1');
    expect(res.status).toBe(400);
  });

  it('404 when source image does not exist', async () => {
    const res = await request(app).get('/api/images?filename=__nope__&width=100&height=100');
    expect(res.status).toBe(404);
  });

  it('200 and caches result when valid (skips if source jpg missing)', async () => {
    try {
      await fs.access(FULL_JPG);
    } catch {
      pending(`Place ${FULL_JPG} to run this integration test.`);
      return;
    }

    await fs.rm(CACHED, { force: true });

    const res = await request(app).get(
      `/api/images?filename=${TEST_NAME}&width=${WIDTH}&height=${HEIGHT}`,
    );
    expect(res.status).toBe(200);

    const cachedExists = await fs
      .access(CACHED)
      .then(() => true)
      .catch(() => false);
    expect(cachedExists).toBeTrue();

    const res2 = await request(app).get(
      `/api/images?filename=${TEST_NAME}&width=${WIDTH}&height=${HEIGHT}`,
    );
    expect(res2.status).toBe(200);
  });
});
