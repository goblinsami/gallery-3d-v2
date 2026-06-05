# Performance Rules

Gallery3D V2 optimizes for fluidity before feature count.

## Targets

Desktop:

- Minimum: 60 FPS
- Preferred: 90+ FPS

Mobile:

- Preferred: 60 FPS
- Minimum: 45 FPS

## Render Loop

The default runtime is render-on-demand.

Render only when:

- Scroll or progress changes.
- Camera easing has not settled.
- Resize or DPR changes.
- Config changes.
- Quality changes.
- Visibility resumes.
- Bottom Sheet state transitions.
- A time-based media item requires it.

A permanent RAF loop requires explicit justification.

## Visibility Pausing

Use both `IntersectionObserver` and the Page Visibility API. Pause rendering when the host is offscreen or the document is hidden. Resume automatically and invalidate exactly one frame before continuing active transitions.

## GPU Rules

- Clamp pixel ratio to `<= 2` on desktop.
- Use lower DPR caps on mobile quality presets where needed.
- Prefer emissive materials and baked glow planes over dynamic lights.
- Use instancing for repeated corridor segments, trims, LED bakes, and structural details.
- Share geometries and materials across items.
- Avoid dynamic shadows by default on mobile.

## Texture Rules

- Use KTX2/Basis for GPU compressed texture delivery.
- Use WebP for fallback and UI-adjacent imagery.
- Avoid oversized PNG/JPG assets.
- Scale texture quality by preset.
- Load lazily around the active journey window.

## Quality Presets

Presets:

- `low`
- `medium`
- `high`
- `ultra`
- `auto`

`auto` resolves at startup and may adjust downward if frame timing degrades. Presets control pixel ratio cap, texture tier, light budget, shadows, geometry density, reflection complexity, and post-processing availability.
