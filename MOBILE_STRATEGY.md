# Mobile Strategy

Mobile is a first-class platform, not a reduced desktop fallback.

## Bottom Sheet

The Bottom Sheet is a core mobile feature.

States:

- `collapsed`: handle, title, minimal information.
- `half`: default reading state with scene still visible.
- `full`: content-first mode with full content, metadata, CTAs, and rich content.

The sheet consumes projected `GalleryItem` content. It must not depend on artwork-specific or station-card-specific structures.

## Camera Awareness

The camera system receives Bottom Sheet state as interaction state.

- Collapsed: prioritize architectural composition.
- Half: subtly reframe active item and preserve scene visibility.
- Full: optionally reposition or crop viewport to keep visual balance.

The sheet never directly controls Three.js objects.

## Mobile Quality Defaults

Automatically reduce pixel ratio cap, dynamic light count, shadow complexity, texture resolution, geometry detail, reflection complexity, and glass complexity.

Do not reduce content availability, journey order, core architectural identity, or touch fluidity.

## Touch Interaction

- Use touch-first gesture handling.
- Avoid scroll locking conflicts between scene progress and sheet content.
- When the sheet is expanded, prioritize sheet scroll gestures.
- When collapsed, prioritize journey gestures.
- Keep all state transitions smooth and reversible.

## Safe Areas

Mobile UI must respect all safe-area inset environment variables.
