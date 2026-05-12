# Design Feature Switch

LibreSpeed supports switching between three designs: **classic**, **modern**, and **neo**.

## Default Behavior

By default, LibreSpeed uses the **classic design** (located in `index-classic.html`).

## Architecture

### File Structure (Non-Docker)
- **`index.html`** - Entry point (lightweight switcher)
- **`index-classic.html`** - Classic design at root
- **`index-modern.html`** - Modern design at root (references assets in subdirectories)
- **`index-neo.html`** - Neo design at root (self-contained, no external assets required)
- **`frontend/`** - Directory containing modern design assets (CSS, JS, images, fonts) - kept for non-Docker deployments

### File Structure (Docker)
In Docker deployments, the frontend assets are flattened to root-level subdirectories:
- **`index.html`** - Entry point (lightweight switcher)
- **`index-classic.html`** - Classic design
- **`index-modern.html`** - Modern design
- **`index-neo.html`** - Neo design (self-contained)
- **`styling/`** - CSS files for modern design
- **`javascript/`** - JS files for modern design
- **`images/`** - Images for modern design
- **`fonts/`** - Fonts for modern design
- **No `frontend/` directory** - Assets are copied directly to root subdirectories

### Benefits of Root-Level Design Files
- All designs at the same level - no path confusion
- `results/` accessible from all designs with the same relative path
- `backend/` accessible from all designs with the same relative path
- No subdirectory nesting issues
- Clean separation of concerns
- Docker containers have no `frontend/` parent directory

## The three designs

| Design   | File                    | Style                                                        |
|----------|-------------------------|--------------------------------------------------------------|
| classic  | `index-classic.html`    | Original LibreSpeed UI with canvas gauges.                   |
| modern   | `index-modern.html`     | Dark theme by fromScratch Studio with gradient gauges.       |
| neo      | `index-neo.html`        | Minimal Apple-inspired UI with cards, light + dark mode.     |

## Browser Compatibility

The feature switch uses modern JavaScript features (URLSearchParams, XMLHttpRequest). It is compatible with all modern browsers.

- The classic design works on older browsers (including IE11).
- The modern design requires modern browser features (see `frontend/README.md`).
- The neo design uses CSS nesting, `clamp()`, `<dialog>`, the Clipboard API and `prefers-color-scheme`; it targets evergreen browsers (Chrome/Edge/Firefox/Safari, last two major versions).

## Selecting a design

There are two ways to select the active design:

### Method 1: Configuration File (Persistent)

Edit `config.json` and set the `design` field to one of `classic`, `modern`, or `neo`:

```json
{
  "design": "neo"
}
```

For backward compatibility, the legacy boolean `useNewDesign` is still honored when `design` is not present:

```json
{
  "useNewDesign": true
}
```

This is equivalent to `{ "design": "modern" }`.

### Method 2: URL Parameter (Temporary Override)

You can override the configuration by adding a URL parameter:

- Neo design: `http://yoursite.com/?design=neo`
- Modern design: `http://yoursite.com/?design=new` (or `?design=modern`)
- Classic design: `http://yoursite.com/?design=classic` (or `?design=old`)

URL parameters take precedence over the configuration file, making them useful for testing or letting users pick their preferred design.

### Method 3: Docker environment variables

Two environment variables are supported:

- `DESIGN=neo|modern|classic` (preferred) — selects the design at container startup.
- `USE_NEW_DESIGN=true` (legacy) — equivalent to `DESIGN=modern`.

When both are set, `DESIGN` wins.

## Technical Details

The feature switch is implemented in `design-switch.js`, which is loaded by the root `index.html`. It checks, in order:

1. URL parameter (`?design=neo|new|classic`)
2. `config.json` — `design` field, then legacy `useNewDesign`
3. Falls back to the classic design

All three design HTML files live at the root level, eliminating path issues.

### Non-Docker
The modern design references assets from the `frontend/` subdirectory (e.g., `frontend/styling/index.css`). The neo design is self-contained — its CSS and JS are inlined in `index-neo.html`, so no extra assets are required. All designs can access shared resources like `backend/` and `results/` using the same relative paths.

### Docker
In Docker deployments, the `frontend/` directory is flattened during container startup. Modern design assets are copied directly to root-level subdirectories (`styling/`, `javascript/`, `images/`, `fonts/`), and `index-modern.html` references these root-level paths. The neo design works out of the box because it is self-contained.
