# Image Processing API (TypeScript + Express + Sharp)

A minimal, scalable image-resizing API with on-disk caching — built from scratch to match the rubric.

## Quick Start

```bash
npm install
# Add at least one JPG into: assets/full (e.g., assets/full/fjord.jpg)
npm run build
npm start
# PORT=8080 npm start   # or omit PORT to use the default
```

Open: `http://localhost:3000/api/images?filename=fjord&width=300&height=300`

- First request resizes and caches to `assets/thumbs/fjord_w300_h300.jpg`
- Subsequent requests are served from cache (faster)

## Health check:
```bash
curl -i "http://localhost:3000/health"
```

## Project Structure

```text
.
├─ assets/
│  ├─ full/                 # originals (input) – include at least one .jpg
│  └─ thumbs/               # cache (output) – created on demand
├─ src/
│  ├─ index.ts              # Express app; mounts routes; /healthz
│  ├─ routes/
│  │  └─ images.ts          # /api/images (validation, cache, responses)
│  └─ utils/
│     └─ imageProcessor.ts  # path helpers + Sharp resizing (pure utility)
├─ src/tests/
│  ├─ api/                  # SuperTest endpoint specs
│  ├─ utils/                # unit tests for the processor
│  └─ indexSpec.ts          # simple smoke spec
├─ spec/support/
│  └─ jasmine.json          # Jasmine CLI config (points to compiled specs)
├─ eslint.config.cjs        # ESLint v9 flat config (Node + Jasmine globals)
├─ tsconfig.json
├─ package.json
└─ README.md

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

- Only `.jpg` is supported to match the rubric.
- No `any` types. ES module imports/exports.
- File-based caching ensures repeat requests are fast.
