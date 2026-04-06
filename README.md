# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## WooCommerce Gift Product Sync

This project includes a script to sync honeymoon package tiers into WooCommerce products for gift-card checkout.

1. Copy `.env.example` values into your local environment.
2. Set `WOO_BASE_URL`, `WOO_CONSUMER_KEY`, and `WOO_CONSUMER_SECRET`.
3. Run a dry run first:

```bash
DRY_RUN=true npm run sync:woo:gifts
```

4. Run actual sync:

```bash
DRY_RUN=false npm run sync:woo:gifts
```

The script creates or updates products by stable SKU (`hm-gift-<destination>-<tier>`), and tags them for honeymoon gift-card flows.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js

## WordPress Home Settings

The homepage "Browse by Style" cards now read their images from the `home-settings` ACF page. In WordPress, set these fields to the uploaded media URLs below:

- `browse_style_beach_image`: `https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1507525428034-b723cf961d3e-scaled.jpg`
- `browse_style_island_image`: `https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1439066615861-d1af74d74000-scaled.jpg`
- `browse_style_adventure_image`: `https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1464822759023-fed622ff2c3b-scaled.jpg`
- `browse_style_city_image`: `https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1502602898657-3e91760cbb34-2-scaled.jpg`

If any field is left empty, the app falls back to the built-in placeholder image.
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
