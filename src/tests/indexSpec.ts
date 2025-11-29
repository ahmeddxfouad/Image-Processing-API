import request from 'supertest';
import app from '../index';

describe('App bootstrap & base routes (index.ts)', () => {
  it('GET /health → 200 and { ok: true }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('GET /api/images without params → 400', async () => {
    const res = await request(app).get('/api/images');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('GET /non-existent → 404', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });
});
