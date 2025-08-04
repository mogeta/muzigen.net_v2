# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands are run from the root of the project:

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start development server at localhost:4321 |
| `pnpm build` | Build production site to ./dist/ |
| `pnpm preview` | Preview build locally |
| `pnpm astro check` | Run TypeScript and Astro checks |

## Architecture

This is an Astro project with Tailwind CSS v4 and Firebase integration:

- **Framework**: Astro 5.x with TypeScript (strict config)
- **Styling**: Tailwind CSS v4 with Vite plugin integration
- **Backend**: Firebase with dual configuration setup
- **Package Manager**: pnpm

### Firebase Configuration

The project uses a dual Firebase setup:

1. **Client-side** (`src/firebase/client.ts`): Basic Firebase app initialization with placeholder config values
2. **Server-side** (`src/firebase/server.ts`): Firebase Admin SDK with environment variable configuration that handles both development and production environments

Server configuration automatically detects PROD environment and uses appropriate credentials:
- Development: Reads from environment variables
- Production: Uses default Firebase function configuration

### Key Files

- `astro.config.mjs`: Astro configuration with Tailwind CSS Vite plugin
- `src/layouts/Layout.astro`: Base HTML layout with global CSS import
- `src/firebase/`: Firebase client and server configurations
- `src/styles/global.css`: Global styles
- `tsconfig.json`: Extends Astro's strict TypeScript configuration

## Development Notes

- Uses ES modules (`"type": "module"` in package.json)
- TypeScript strict mode enabled
- Tailwind CSS v4 integrated via Vite plugin (not PostCSS)
- Firebase environment variables needed for server-side functionality in development