# Gallery3D V2 Usage

## Build

```bash
npm install
npm run build
npm run dev:demo
```

Open the local Vite URL, for example `http://localhost:5173`.

## Web Component

```html
<scrollix-gallery></scrollix-gallery>
<script type="module">
  import { premiumCorridorProject } from "./dist/index.js";
  import { defineScrollixGalleryElement } from "./dist/element.js";

  defineScrollixGalleryElement();
  document.querySelector("scrollix-gallery").project = premiumCorridorProject;
</script>
```

## Runtime API

```ts
import { mountGalleryRuntime } from "gallery-3d-v2";

const runtime = await mountGalleryRuntime({
  container,
  project,
});

runtime.nextItem();
runtime.previousItem();
runtime.focusItem("intro");
runtime.setBottomSheetState("half");
```

The runtime consumes a `GalleryProject`. All external projects are validated before rendering.

## Framer Adapter

```ts
import { mountScrollixGallery } from "gallery-3d-v2";

const adapter = await mountScrollixGallery({
  container,
  props: {
    project,
    bottomSheetState: "half",
    initialProgress: 0,
  },
});

await adapter.update({ project, initialProgress: 0.5 });
adapter.dispose();
```
