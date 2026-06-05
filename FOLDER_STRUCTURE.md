# Folder Structure

```text
gallery-3d-v2/
  ARCHITECTURE.md
  JSON_SPEC.md
  PERFORMANCE_RULES.md
  FOLDER_STRUCTURE.md
  RENDERING_GUIDELINES.md
  MOBILE_STRATEGY.md
  FRAMER_INTEGRATION.md
  package.json
  tsconfig.json
  src/
    core/
      GalleryEngine.ts
      Registry.ts
    types/
      GalleryProject.ts
      GalleryItem.ts
      Renderer.ts
      Layout.ts
      Journey.ts
      Quality.ts
      Runtime.ts
    layouts/
      CorridorLayout.ts
      InfiniteCorridorLayout.ts
      GalleryRoomLayout.ts
    renderers/
      ArtworkRenderer.ts
      StatementRenderer.ts
      VideoRenderer.ts
      CtaRenderer.ts
      QuoteRenderer.ts
      ProfileRenderer.ts
      ImageRenderer.ts
    journey/
      JourneyController.ts
    lighting/
      ArchitecturalBake.ts
    runtime/
      RuntimeManager.ts
    framer/
      ScrollixGallery.tsx
    utils/
      assertNever.ts
      clamp.ts
      validateGalleryProject.ts
    index.ts
```

## Ownership

- `core` owns orchestration and lifecycle.
- `types` owns public contracts.
- `layouts` owns spatial placement only.
- `renderers` owns item object creation only.
- `journey` owns progress and camera state math.
- `lighting` owns architecture lighting strategies.
- `runtime` owns framework-independent mount/update/dispose.
- `framer` owns Framer controls and config construction only.
- `utils` owns pure helpers.

Target maximum: 300 lines per file.
