# Tests (Web-App)

Runner: **Vitest** + **Testing Library** (jsdom). Config: `vitest.config.ts`, global setup: `tests/setup.ts`.

All tests live under `tests/`, mirroring `src/` (`tests/lib/`, `tests/services/`, `tests/components/`). Source stays test-free.

## Commands

```bash
npm test
npm run test:watch
npm run test:ui
npm run test:coverage
```