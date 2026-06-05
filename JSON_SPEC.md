# Gallery3D V2 JSON Spec

The entire experience is generated from one configuration object.

```ts
interface GalleryProject {
  theme: ThemeConfig;
  layout: LayoutConfig;
  journey: JourneyConfig;
  items: GalleryItem[];
}
```

## Goals

- Content agnostic.
- Strictly validated before use.
- Stable for saved projects and embeds.
- Extensible without engine changes.
- Friendly to Framer controls and standalone JSON.

## GalleryProject

| Field | Purpose |
| --- | --- |
| `theme` | Visual identity, materials, atmosphere, quality preferences. |
| `layout` | Spatial strategy and layout-specific options. |
| `journey` | Scroll behavior, camera motion, keyframe policy, loop policy. |
| `items` | Ordered content and placement inputs. |

## GalleryItem

```ts
interface GalleryItem {
  id: string;
  type: string;
  placement: PlacementConfig;
  appearance: AppearanceConfig;
  content: Record<string, unknown>;
}
```

Everything visible or narratively addressable is an item.

Initial registered item types:

- `artwork`
- `statement`
- `quote`
- `profile`
- `image`
- `video`
- `cta`

The engine must not hardcode this list. These are initial renderers, not engine branches.

## PlacementConfig

Placement describes spatial intent, not rendered geometry.

- `slot`: ordered journey position.
- `side`: optional side preference for corridor-like layouts.
- `anchor`: optional named architectural anchor.
- `offset`: local placement offset.
- `scale`: item scale multiplier.
- `priority`: layout conflict preference.

## AppearanceConfig

Appearance describes renderer hints shared across item types.

- `variant`: renderer-specific visual variant.
- `material`: material family or material token.
- `size`: semantic or numeric size.
- `lighting`: item-level lighting emphasis.
- `media`: optional texture/video source references.

## Content

`content` is intentionally open, but adapters should project it through shared content helpers before displaying it in panels.

Common optional fields:

- `title`
- `subtitle`
- `eyebrow`
- `description`
- `body`
- `metadata`
- `actions`
- `media`

## Validation

Validation must clamp numeric ranges, fill defaults, reject duplicate item ids, preserve unknown `content` fields, normalize layout and journey modes, and resolve quality presets before runtime creation.

Validation must not mutate raw config, infer rendering behavior through hardcoded type switches, load textures, or create Three objects.
