# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/`: Route entrypoints (`.astro`) including blog, profile, and game pages.
- `src/components/`: Reusable UI components (`.astro`, `.jsx`, `.ts`).
- `src/content/posts/`: Markdown blog content managed by `src/content/config.ts`.
- `src/layouts/`, `src/styles/`, `src/utils/`, `src/lib/`, `src/types/`: shared layout, styling, helpers, and types.
- `public/`: Static assets (images, favicons, and Ebiten game bundles).
- `dist/`: Build output from Astro.
- Firebase settings live in `src/firebase/` plus root config files like `firebase.json` and `firestore.rules`.

## Build, Test, and Development Commands
- `pnpm install`: Install dependencies.
- `pnpm dev`: Run Astro dev server at `http://localhost:4321`.
- `pnpm build`: Create production build in `dist/`.
- `pnpm preview`: Serve built output locally for final checks.
- `pnpm astro check`: Run Astro + TypeScript diagnostics (use as the primary quality gate).

## Coding Style & Naming Conventions
- TypeScript is strict (`tsconfig.json` extends `astro/tsconfigs/strict`).
- Follow file-local style: this repo currently has mixed indentation/quote styles; match surrounding code instead of mass reformatting.
- Use descriptive PascalCase for components (`ArticleCard.astro`), camelCase for utilities (`remarkAutoEmbed`), and kebab/dynamic segment naming for routes (`[...slug].astro`).
- Keep modules focused and colocate content schemas/config with related features.

## Testing Guidelines
- There is no fully wired automated test suite in the repository yet.
- Minimum validation for every change:
  1. `pnpm astro check`
  2. `pnpm build`
  3. Manual smoke test of affected routes/components in `pnpm dev` or `pnpm preview`
- If adding automated tests, prefer Playwright-style E2E coverage and place specs under a dedicated `tests/` folder.

## Commit & Pull Request Guidelines
- Follow Conventional Commit style seen in history: `feat:`, `fix:`, `refactor:`, `chore:`.
- Keep commit messages imperative and scoped to one logical change.
- PRs should include:
  1. Clear summary and motivation
  2. Linked issue/task (if available)
  3. Verification notes (`astro check`, build, manual checks)
  4. Screenshots/GIFs for visible UI changes

## Security & Configuration Tips
- Do not commit secrets from `.env`.
- Firebase Admin/client config should be environment-driven; verify required variables before running server-side features.
