# Image Processing API (TypeScript + Express + Sharp)

A minimal, scalable image-resizing API with on-disk caching — built from scratch to match the rubric.

## Quick Start

```bash
npm install
# Add at least one JPG into: assets/full (e.g., assets/full/fjord.jpg)
npm run build
npm start
```

Open: `http://localhost:3000/api/images?filename=fjord&width=300&height=300`

- First request resizes and caches to `assets/thumbs/fjord_w300_h300.jpg`
- Subsequent requests are served from cache (faster)

## Project Structure

```text
src/
  index.ts
  routes/images.ts
  utils/imageProcessor.ts
tests/
  api/imagesSpec.ts
  utils/imageProcessorSpec.ts
  helpers/reporter.ts
assets/
  full/   # put original JPGs here
  thumbs/ # cached resized images
```

## NPM Scripts

- `npm test` → Jasmine tests (SuperTest + unit tests)
- `npm run lint` → ESLint
- `npm run format` → Prettier
- `npm run build` → Compile TS to `dist/`
- `npm start` → Start server from compiled JS

## Endpoint

`GET /api/images?filename=<name>&width=<int>&height=<int>`

Errors:

- 400: missing/invalid params
- 404: source file not found
- 500: unexpected server error

## Notes

- Only `.jpg` supported to match the rubric.
- No `any` types. ES module imports/exports.
- File-based caching ensures repeat requests are fast.
