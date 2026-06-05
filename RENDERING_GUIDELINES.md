# Rendering Guidelines

## Visual Direction

The experience should feel architectural, cinematic, premium, calm, physical, and elegant. The architecture creates immersion. Avoid gaming aesthetics, flashy effects, aggressive animation, and excessive overlays.

## Scene Construction

- Build scene graph from validated project only.
- Layouts produce positioned item descriptors.
- Renderers produce item objects through `ItemRenderer` contracts.
- Registry resolves renderers by item type.
- Engine assembles layout, renderers, lighting, camera, and journey state.

## Materials

Supported material families:

- `stone`
- `concrete`
- `wood`
- `metal`
- `glass`

Materials should be physically plausible but optimized. Prefer shared material instances, restrained roughness/metalness values, and texture tiers.

## Lighting

The Architectural LED Bake concept remains central.

Prioritize emissive strips, baked glow surfaces, instanced glow planes, rake-light illusions with bounded light counts, fog, and inexpensive scene color.

Avoid excessive point lights, excessive spot lights, dynamic shadows as a default, and post-processing as a requirement for visual quality.

## Geometry

- Use instancing for repeated architecture.
- Share geometries for item frames and structural details.
- Share materials by preset and family.
- Add layout-level culling hints for far or repeated content.

## Camera

Camera movement should feel smooth, natural, and physical. Progress is normalized and clamped. Interpolation helpers stay pure and testable. Active item resolution is deterministic. Camera composition may react to Bottom Sheet state through explicit interaction state.

## Infinite Corridor

Infinite mode should repeat structural modules rather than content blindly, vary architectural accents with deterministic seeds, preserve journey continuity through loop phases, and hide resets through architectural transitions or configured white-loop phases.
