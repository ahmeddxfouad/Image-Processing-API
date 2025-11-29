import express, { Request, Response } from 'express';
import imagesRouter from './routes/images.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

app.use('/api/images', imagesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);

    console.log(`Try: http://localhost:${port}/api/images?filename=camera&width=300&height=300`);
  });
}

export default app;
