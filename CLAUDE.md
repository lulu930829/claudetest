# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (port 3000, auto-open browser)
- `npm run build` - Build for production (type-check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with automatic fixes for .vue, .js, .ts files
- `npm run format` - Format code with Prettier (src/**/*.{vue,js,ts,jsx,tsx,css,scss,json})
- `npm run type-check` - TypeScript type checking only (no emit)
- `npm run prepare` - Install Husky git hooks (run after clone)

## Architecture

This is a Vue 3 (Composition API) + TypeScript + Vite single-page application for an e-commerce mall frontend.

### Core Stack
- **UI Framework**: Vue 3 with Composition API
- **Build Tool**: Vite with Vue plugin
- **Language**: TypeScript
- **UI Library**: Vant (mobile-first component library)
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Styling**: CSS/SCSS with SCSS preprocessing

### Key Configuration
- **Auto-imports**: `unplugin-auto-import` automatically imports Vue, Vue Router, and Pinia APIs. Generated types at `src/types/auto-imports.d.ts`.
- **Component Auto-import**: `unplugin-vue-components` with `@vant/auto-import-resolver` automatically imports Vant components. Generated types at `src/types/components.d.ts`.
- **Path Alias**: `@` maps to `/src` (configured in Vite).
- **SCSS Variables**: Global SCSS variables imported via `@import "@/assets/styles/variables.scss"` (file may need to be created).
- **Proxy**: Development server proxies `/api` to `http://localhost:8080` with path rewrite (remove `/api` prefix).
- **Build**: Targets ES2020, minification with Terser (drops console/debugger in production), hashed output files.

### Project Structure
The current `src/` is minimal; the README.md describes an aspirational structure with modules for API, components, composables, stores, etc. New code should follow that modular organization.

## Code Quality

- **ESLint**: Configured with Vue 3, TypeScript, and Prettier rules. Some strict rules are disabled (multi-word component names, `any` usage, etc.).
- **Prettier**: Config includes single quotes, no semicolons, 2-space tabs, 100 print width.
- **Git Hooks**: Husky + lint-staged configured. The `prepare` script installs Husky. On commit, lint-staged runs ESLint and Prettier on staged files (see `.lintstagedrc.js`). Also optimizes images with `imagemin-lint-staged` (ensure dependency installed).
- **Testing**: No test framework configured yet. The `test` script in package.json is missing; consider adding Vitest or Jest.

## Development Notes

- **Component Naming**: Vue component names can be single-word (ESLint rule `vue/multi-word-component-names` is off).
- **TypeScript**: `any` is allowed (`@typescript-eslint/no-explicit-any: off`). Unused variables are flagged except those prefixed with `_`.
- **Console/Debugger**: Allowed in development, warnings in production.
- **Environment Variables**: Use `VITE_` prefix for client-side variables (e.g., `VITE_API_BASE_URL`). See README.md for examples.
- **Responsive Design**: Project aims for mobile-first responsive design (Vant components are mobile-optimized).

## Adding New Features

1. **API Calls**: Place API functions in `src/api/modules/` (directory may need creation). Use Axios instance from `src/api/request.ts`.
2. **State**: Create Pinia stores in `src/stores/`.
3. **Composables**: Reusable Composition API functions go in `src/composables/`.
4. **Components**: Place shared components in `src/components/` with appropriate subdirectories (`common/`, `business/`, `layout/`).
5. **Pages**: Add Vue components in `src/views/` grouped by feature.

## Troubleshooting

- If auto-imports cause TypeScript errors, ensure `src/types/auto-imports.d.ts` and `src/types/components.d.ts` are generated (they should be created automatically on first run).
- If Vant components are not recognized, check that `unplugin-vue-components` resolver is correctly configured in `vite.config.ts`.
- If SCSS variables are missing, create `src/assets/styles/variables.scss`.
