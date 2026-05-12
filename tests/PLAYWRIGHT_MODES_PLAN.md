# Playwright Plan: Runtime Modes

## Objective
Validate LibreSpeed behavior across all supported deployment modes
without asserting real network throughput values.

## Modes Covered

### Docker runtime modes
- `standalone`
- `backend`
- `frontend`
- `dual`

### Customization smoke
- `TITLE` substitution with special characters (umlauts, quotes, apostrophes)

## Test Strategy

Assertions stay deterministic — no real bandwidth numbers. We check:
- HTTP availability of expected files/endpoints
- Expected UI controls rendered
- Server list loading behavior
- `TITLE` substitution

The single `index.html` is the only UI entry point; there is no design
switch to test.

## Files
- `playwright.config.js`
- `tests/e2e/modes.spec.js` — runtime mode smoke coverage
- `tests/e2e/title-special-chars.spec.js` — TITLE escaping
- `tests/e2e/global-setup.js` / `global-teardown.js`
- `tests/e2e/helpers/env.js` — port map
- `tests/e2e/helpers/ui.js` — shared selectors
- `tests/docker-compose-playwright.yml` — multi-service test stack
- `tests/e2e/fixtures/*.json` — mounted server lists for frontend/dual

## Running

```bash
npm run test:e2e
```

Requires Docker available locally; the global setup spins up the
compose stack on ports 18180-18185 and tears it down at the end.

## Selector policy
Use role/text selectors anchored on stable labels and IDs already in
the page; avoid brittle CSS-path selectors.

## CI
- Docker workflow runs e2e first, then build/push only if e2e passes.
- Playwright retries: `1` in CI, `0` locally.
- Upload traces/screenshots on failure only.
- Browser scope for v1: Chromium only.
