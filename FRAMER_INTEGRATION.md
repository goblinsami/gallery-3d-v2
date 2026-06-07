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

## Production Code Component

`src/framer/ScrollixGalleryFramer.tsx` is the Framer code component entry exported as `gallery-3d-v2/framer`.

It exposes the complete Playground control set:

- Template, texture/material, quality, atmosphere, overlay framing, item borders.
- Corridor spacing, width, height, depth, ceiling light, FOV, camera height, look-ahead, smoothing, damping, scroll strength and loop.
- Runtime host controls: initial progress, auto-start journey, panel state, mobile UI, content UI and progress bar.

It also exposes controlled item content through a Framer `Array` control:

- Type: statement, artwork, quote, profile, image, video or CTA.
- Placement: station, left wall, right wall or automatic wall.
- Content: eyebrow, title, subtitle, description, body.
- Media: image URL, alt text, material, size, lighting, variant, slot, scale and offsets.

`src/framer/framerProjectAdapter.ts` keeps the Framer prop normalization pure and testable. The TSX file only owns React/Framer lifecycle, Shadow DOM hosting, property controls and UI attachment.
