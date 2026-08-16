# AGENTS.md

Angular 22.1 standalone SPA (no NgModules) with Tailwind CSS v4, tested with Vitest, deployed to GitHub Pages.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm start` (`ng serve`, http://localhost:4200) |
| Build | `npm run build` (`ng build`, production by default) |
| Watch build | `npm run watch` |
| Unit tests | `npm test` (`ng test`) |
| Generate | `npm run ng -- generate component name` |

- There is **no lint script** and no ESLint config. Use `ng build` for type/template checking.
- Formatting is Prettier (`.prettierrc`: width 100, single quotes, `angular` parser for `*.html`); format-on-save is set in the devcontainer.

## Testing

- Vitest, not Karma/Jasmine. The builder is `@angular/build:unit-test` (`ng test`).
- Specs are colocated (`src/**/*.spec.ts`) and included only via `tsconfig.spec.json`.
- No e2e framework is configured; `ng e2e` is not set up.

## Styling

- Generated components use **SCSS** (schematic default in `angular.json`), but the global stylesheet is `src/styles.css`.
- Tailwind v4 is **CSS-first**: no `tailwind.config.js`. It is wired via `.postcssrc.json` (`@tailwindcss/postcss`) and the single `@import "tailwindcss";` in `src/styles.css`. Theme/customization goes in CSS, not a JS config.

## Angular 22 specifics

- Zoneless by default; `app.config.ts` only registers `provideBrowserGlobalErrorListeners()` and `provideRouter(routes)`. Do not add `provideZoneChangeDetection`.
- Root component is `App` (`app-root`) — the new convention drops the `Component` suffix. Component selector prefix is `app`.
- Uses signals and `@for`/`@if` control flow (no `*ngIf`/`*ngFor`).

## Deploy

- `.github/workflows/deploy.yml` builds on push to `main` with `--base-href /Battlesword-4.000-SPA/`, copies `index.html` to `404.html` (SPA routing fallback), and publishes `dist/battlesword-spa/browser` to `gh-pages` via `peaceiris/actions-gh-pages`.
- Any production build intended for GitHub Pages must keep that base-href; otherwise asset/route paths break.
- CI uses Node 24 and `npm ci`.
