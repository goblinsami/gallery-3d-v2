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

## Theme Materials

`theme.materials.textureTiling` controls texture repeat multipliers while preserving each material family's base scale.

- `wall`: wall texture tiling multiplier.
- `floor`: floor texture tiling multiplier.
- `ceiling`: ceiling texture tiling multiplier.
- `wallDeformation`, `floorDeformation`, `ceilingDeformation`: `stretched` keeps the family repeat proportions; `square` adjusts the secondary axis so tiles keep a more physical square proportion on that surface.

## Theme Lighting

`theme.lighting` controls global architectural light treatment.

- `ceilingLightIntensity`: intensity multiplier for ceiling downlights, glow and upper bounce.
- `ceilingLightRadius`: physical radius of the upper downlight fixture ring; the lit core scales with it.

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

## JourneyConfig

Journey controls camera progression and optional loop transitions.

```ts
interface JourneyConfig {
  mode: "scroll" | "manual";
  loop?: boolean;
  smoothing?: number;
  damping?: number;
  scrollStrength?: number;
  camera?: CameraJourneyConfig;
}

interface CameraJourneyConfig {
  height?: number;
  fov?: number;
  lookAhead?: number;
  desktopFramingDistance?: number;
  mobileFramingDistance?: number;
  mobileStationFramingDistance?: number;
}
```

When `loop` is enabled, progress can continue past the final keyframe and wraps back to the journey start.
`scrollStrength` multiplies wheel/touch sensitivity; `1` keeps the default runtime feel.
`desktopFramingDistance`, `mobileFramingDistance`, and `mobileStationFramingDistance` multiply the computed item framing distance. Use `1` for the original framing, and larger values to pull the camera back.

## Validation

Validation must clamp numeric ranges, fill defaults, reject duplicate item ids, preserve unknown `content` fields, normalize layout and journey modes, and resolve quality presets before runtime creation.

Validation must not mutate raw config, infer rendering behavior through hardcoded type switches, load textures, or create Three objects.
