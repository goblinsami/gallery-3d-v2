# Gallery3D V2 Architecture

Gallery3D V2 is a JSON-driven immersive 3D storytelling engine. It is not an art-gallery-specific runtime. Artworks are one item type among many.

## Runtime Flow

```text
raw config -> validate project -> resolve quality -> layout project -> register renderers -> create scene graph -> build journey -> apply progress -> render on demand
```

The engine keeps one directional flow:

```text
input event -> JourneyController -> normalized progress -> GalleryEngine.applyJourneyState -> render invalidation
```

No renderer, adapter, content panel, or journey helper may mutate the source config.

## Priorities

1. Fluidity
2. Performance
3. Scalability
4. Maintainability
5. Realism
6. Features

A feature that damages smoothness, bloats scene construction, or couples adapters to engine internals is not ready.

## Modules

- `types`: public data model and cross-module contracts.
- `core`: engine lifecycle, registries, orchestration, render invalidation, visibility state.
- `layouts`: item placement and navigation topology. Layouts never inspect item content.
- `renderers`: item-type object factories. Renderers know item appearance and content, but not journey state.
- `journey`: progress, keyframes, camera interpolation, active item resolution, loop phases.
- `lighting`: baked and fake architectural lighting systems with quality-scaled light budgets.
- `runtime`: framework-independent mount, update, and dispose manager.
- `framer`: adapter only. It builds `GalleryProject` and passes it to runtime.
- `utils`: pure helpers, validation helpers, texture helpers, device hints.

## Core Contracts

- `LayoutStrategy` receives validated project layout data and returns positioned items.
- `ItemRenderer` receives a positioned `GalleryItem` and creates a render object.
- `JourneyController` owns scroll input, smoothing, normalized progress, loop phases, and active item state.
- `RuntimeManager` owns host integration and lifecycle, but not Three.js details.
- `RendererRegistry` resolves item renderers without scattered item-type branches.

## Preserved Legacy Concepts

- JSON-driven runtime.
- Normalized progress as the timeline abstraction.
- Scroll-driven journey with camera keyframes.
- Smooth interpolation with deterministic active item resolution.
- Infinite Corridor as a journey and layout mode.
- Architectural LED Bake as fake/baked lighting rather than heavy dynamic lighting.
- Runtime embedding as a first-class distribution path.
- Mobile Bottom Sheet as the primary mobile content interaction layer.

## V2 Corrections

- Generic item naming replaces artwork/station-specific engine concepts.
- Bottom Sheet content is projected from `GalleryItem`, not hardcoded item families.
- Render scheduling is invalidation-based from day one.
- Adapters build config and forward lifecycle only.
- Large files over 300 lines require review and split planning.

## Bottom Sheet

The Bottom Sheet consumes `GalleryItem` through a content projection layer. It must not know about artworks, station cards, or renderer internals.

States:

- `collapsed`: architecture-first framing.
- `half`: default mobile reading state with scene still visible.
- `full`: content-first state with camera and viewport compensation.

Camera awareness belongs in journey/camera composition. The sheet emits state; the engine resolves framing.
