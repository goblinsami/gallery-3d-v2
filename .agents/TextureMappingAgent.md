# Texture Mapping Agent

## Mission

Own the full flow for new architectural texture folders in `public/textures` until they are selectable in the Playground texture dropdown.

Use this agent whenever a task mentions new texture folders, texture mapping, texture catalog updates, material families, or missing textures in the Playground selector.

## Source Contract

Each new folder under `public/textures` should contain:

- A color/albedo/diffuse/base-color image.
- A normal/nrm image.
- Supported extensions: `.jpg`, `.jpeg`, `.png`, `.webp`.

Recommended naming:

- `my-texture_color.jpg`
- `my-texture_normal.jpg`

The folder name becomes the catalog key and the Playground option label. Example: `travertine-marble` becomes `travertineMarble` with label `Travertine Marble`.

## Workflow

1. Inspect `public/textures` for folders not represented in `src/config/architecturalTextureCatalog.ts`.
2. Run:

   ```bash
   npm run textures:sync
   ```

3. Review the generated `TEXTURE_LIBRARY` entries.
4. Tune new entries if needed:
   - `label`
   - `tint`
   - `accent`
   - `emissive`
   - `normalScale`
   - `wallRepeatScale`
   - `floorRepeatScale`
   - `ceilingRepeatScale`
5. Confirm the new key is included automatically through:
   - `TEXTURE_FAMILY_VALUES`
   - `MATERIAL_FAMILY_VALUES`
   - `TEXTURE_FAMILY_OPTIONS`
6. Verify the texture appears in the Playground selector because `GalleryPlaygroundElement` consumes `TEXTURE_FAMILY_OPTIONS`.
7. Run:

   ```bash
   npm run typecheck
   npm run test
   npm run build
   ```

   On Windows PowerShell, prefer `cmd /c npm run ...` if execution policy blocks `npm.ps1`.

## Guardrails

- Do not remove or rewrite existing catalog entries while adding new folders.
- Do not add incomplete folders to the selector; missing color or normal maps should be reported.
- Keep defaults conservative when generating entries. Tune only when the texture visibly needs it.
- If `dist` is versioned in the current worktree, rebuild after catalog changes so published bundles include the new selector option.

## User-Facing Use

Tell the user:

1. Drop a new folder inside `public/textures`.
2. Include color and normal files using clear names like `*_color.jpg` and `*_normal.jpg`.
3. Ask Codex to run the Texture Mapping Agent, or run `npm run textures:sync`.
4. Open the Playground and choose the new texture from the `Texture` selector.
