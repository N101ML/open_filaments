# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (Vite HMR)
npm run build      # tsc -b && vite build
npm run lint       # eslint
npx tsc --noEmit   # type-check without building
```

There are no tests.

## Architecture

Single-page React app for tracking 3D printer filament inventory. No backend — all data is persisted to `localStorage` under the key `filament-tracker-data`.

### State

`FilamentContext` (`src/context/FilamentContext.tsx`) is the single source of truth. It exposes:
- `state: AppData` — persisted data (filaments, brands, materials, colors), managed by `useReducer`
- `dispatch` — the only way to mutate persisted data; all action types are in `AppAction` (`src/types/index.ts`)
- `filteredFilaments` — computed by `useFilterSort` hook; never stored in state
- `modal`, `filter`, `sort` — ephemeral UI state, not persisted

On first load, `loadFromStorage` seeds from `defaultAppData` (`src/data/defaults.ts`) which contains fixed UUIDs for the default brands/materials/colors.

### Data model

`Filament` holds only foreign keys (`brandId`, `materialId`, `colorId`) referencing the lookup lists on `AppData`. Resolving display names requires looking up by ID against `state.brands`, `state.materials`, `state.colors`.

Colors always store hex as 7-char lowercase `#rrggbb` (enforced by `normalizeHex` in `src/utils/colorUtils.ts`). Deduplication for colors is by hex; for brands/materials it is by name (case-insensitive).

### Key component patterns

**`SelectOrAdd<T>`** (`src/components/shared/SelectOrAdd.tsx`) — generic combobox/select for any lookup list. Accepts a `searchable` prop (used only for colors) which replaces the native `<select>` with a filtered combobox. The dropdown is rendered via `createPortal` into `document.body` with `position: fixed` coordinates — this is intentional to escape the modal's `overflow-y-auto` clipping. The `addNewSlot` render prop receives a `cancelFn` so custom add UIs (like `ColorPicker`) can dismiss add mode.

**`FilamentForm`** — after dispatching `ADD_BRAND` or `ADD_MATERIAL`, the new item's ID isn't available until the next render. The form uses a "pending name" pattern (`pendingBrandName` / `pendingMaterialName`) — it stores the name, then on the next render resolves it to an ID from the updated state and calls `setBrandId` / `setMaterialId`.

**`Modal`** — uses `createPortal` to `document.body`, `max-h-[90vh]` with `overflow-y-auto` on the content div. Any absolutely-positioned children that need to escape this overflow must also use a portal.

## TypeScript notes

`verbatimModuleSyntax` is enabled — all type-only imports must use `import type`. Mixing value and type imports in a single statement requires the inline `type` modifier (e.g. `import { useState, type ReactNode }`).
