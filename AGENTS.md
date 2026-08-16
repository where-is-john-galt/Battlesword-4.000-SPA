# AGENTS.md

Angular 22.1 standalone SPA (no NgModules) with Tailwind CSS v4, tested with Vitest, deployed to GitHub Pages.

## Project purpose

This repo is a **SPA that assists play of the "Battlesword 4.000" RPG system**. The system itself is NOT authored here — it lives in the `Battlesword-4.000/` git submodule (upstream: https://github.com/Iwanuss/Battlesword-4.000), which is the source of truth for the rules written in Polish Markdown files (`manifest.me`, `TODO`, `patch_notes.md`, and directories `bestiariusz/`, `ekwipunek/`, `mechaniki_bazowe/`, `tworzenie_postaci/`, `walka/`).

- The rules are the specification. When building features, read the relevant `.md` from `Battlesword-4.000/` first and match it (it is a work-in-progress alpha — content changes over time).
- Battlesword is a d100-style roll-under system: roll ≤ stat succeeds, and how far under determines degrees of success. Combat is old-school, favoring planning/preparation; characters have a **profession** (past skills/passives) and a **combat class**; progression spends PD (XP) on stats/talents/perks — closest to Dark Heresy.
- The submodule is a separate repo; do not edit its files from here (changes must go upstream).

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm start` (`ng serve`, http://localhost:4200) |
| Build | `npm run build` (`ng build`, production by default) |
| Watch build | `npm run watch` |
| Unit tests | `npm test` (`ng test`) |
| Storybook | `npm run storybook` (`ng run battlesword-spa:storybook`, http://localhost:6006) |
| Storybook build | `npm run build-storybook` (`ng run battlesword-spa:build-storybook`) |
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

## Storybook

- Storybook 10.5 must be driven through the **Angular builder** (wired in `angular.json` as `storybook` / `build-storybook` targets with `browserTarget: battlesword-spa:build`). Do NOT run `storybook dev`/`storybook build` directly — it throws `AngularLegacyBuildOptionsError`.
- Targets set `tsConfig: .storybook/tsconfig.json`, which must `include` both `src/**/*.ts` (the components + stories) and `.storybook/*.ts` (preview). `@ngtools/webpack` errors if a compiled file is missing from the TS program.
- `experimentalZoneless: true` (default for Angular ≥21) avoids injecting `zone.js` into the preview.
- `@angular-devkit/build-angular` is pinned to `22.x` (not the latest `21.x` npm would resolve) to match Angular 22 peer deps — it provides the webpack config Storybook reuses.
- Addons: only `@storybook/addon-docs` and `@storybook/addon-a11y` are versioned at 10.x; the essentials (controls/actions/backgrounds/viewport) are built into Storybook core.
- Design tokens live in `src/styles.css` (Tailwind v4 `@theme`); components under `src/app/ui/` with colocated `*.stories.ts`. See `docs/DESIGN.md`.

## Deploy

- `.github/workflows/deploy.yml` builds on push to `main` with `--base-href /Battlesword-4.000-SPA/`, copies `index.html` to `404.html` (SPA routing fallback), and publishes `dist/battlesword-spa/browser` to `gh-pages` via `peaceiris/actions-gh-pages`.
- Any production build intended for GitHub Pages must keep that base-href; otherwise asset/route paths break.
- CI uses Node 24 and `npm ci`.
