# Framer Integration

Framer is an adapter. It is not the runtime.

## Responsibilities

Framer may expose controls, build a `GalleryProject`, mount and update runtime, and pass sizing or host lifecycle signals.

Framer must not manage Three.js rendering, camera interpolation, runtime lifecycle internals, item rendering logic, or layout algorithms.

## File Size

`ScrollixGallery.tsx` target: under 300 lines.

If controls grow beyond that, split into control schema, default project builder, property normalizers, and React component adapter.

## Data Flow

```text
Framer props -> adapter normalization -> GalleryProject -> RuntimeManager.updateProject
```

The Framer adapter should be replaceable without touching core runtime modules.

Controls should map to stable public config fields and avoid leaking engine internals.

## Current Adapter Surface

`src/framer/ScrollixGallery.tsx` exposes `mountScrollixGallery`, a thin host adapter that accepts Framer-facing props, validates JSON/object project input, applies optional quality override, mounts the shared runtime, and supports update/dispose.

The file intentionally contains no Three.js scene logic and no renderer lifecycle internals.
