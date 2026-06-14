import * as React from "react";
import { addPropertyControls, ControlType } from "framer";
import type { BottomSheetView } from "../runtime/createBottomSheetView";
import type { DesktopPanelView } from "../runtime/createDesktopPanelView";
import type { RuntimeStateUnsubscribe } from "../types/Runtime";
import { scrollixGalleryStyles } from "../elements/scrollixGalleryStyles";
import { createBottomSheetView } from "../runtime/createBottomSheetView";
import { createDesktopPanelView } from "../runtime/createDesktopPanelView";
import {
  buildScrollixGalleryFramerProject,
  normalizeQualityOverride,
  scrollixGalleryFramerDefaults,
  type ScrollixGalleryFramerProps,
} from "./framerProjectAdapter";
import {
  mountScrollixGallery,
  type ScrollixGalleryAdapter,
  type ScrollixGalleryProps,
} from "./ScrollixGallery";

interface ShadowParts {
  root: ShadowRoot;
  viewport: HTMLElement;
  progress: HTMLElement;
  progressFill: HTMLElement;
}

interface ViewState {
  bottomSheet: BottomSheetView | null;
  desktopPanel: DesktopPanelView | null;
  unsubscribeProgress: RuntimeStateUnsubscribe | null;
}

const materialOptions = ["stone", "brick", "wood", "concrete", "metal", "glass"];
const qualityOptions = ["auto", "low", "medium", "high", "ultra"];
const itemTypeOptions = ["statement", "artwork", "quote", "profile", "image", "video", "cta"];
const placementOptions = ["station", "wall-left", "wall-right", "wall-auto"];
const sizeOptions = ["small", "medium", "large"];
const lightingOptions = ["none", "subtle", "featured"];
const scrollStrengthOptions = ["auto", 0.5, 0.75, 1, 1.5, 2, 3, 4, 5];
const textureDeformationOptions = ["stretched", "square"];

const getShadowParts = (host: HTMLElement): ShadowParts => {
  const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
  let viewport = root.querySelector<HTMLElement>(".viewport");
  let progress = root.querySelector<HTMLElement>(".progress");
  let progressFill = root.querySelector<HTMLElement>(".progress__fill");

  if (!viewport || !progress || !progressFill) {
    root.innerHTML = `
      <style>${scrollixGalleryStyles}</style>
      <div class="viewport"></div>
      <div class="progress" aria-hidden="true"><div class="progress__fill"></div></div>
    `;
    viewport = root.querySelector<HTMLElement>(".viewport");
    progress = root.querySelector<HTMLElement>(".progress");
    progressFill = root.querySelector<HTMLElement>(".progress__fill");
  }

  if (!viewport || !progress || !progressFill) {
    throw new Error("ScrollixGalleryFramer shadow host was not created.");
  }

  return { root, viewport, progress, progressFill };
};

const syncContentViews = (
  adapter: ScrollixGalleryAdapter,
  parts: ShadowParts,
  views: ViewState,
  showContentUi: boolean,
): void => {
  if (!showContentUi) {
    views.bottomSheet?.dispose();
    views.desktopPanel?.dispose();
    views.bottomSheet = null;
    views.desktopPanel = null;
    return;
  }

  if (!views.bottomSheet) {
    views.bottomSheet = createBottomSheetView(adapter.runtime);
    parts.root.appendChild(views.bottomSheet.element);
  }

  if (!views.desktopPanel) {
    views.desktopPanel = createDesktopPanelView(adapter.runtime);
    parts.root.appendChild(views.desktopPanel.element);
  }
};

const syncProgressView = (
  adapter: ScrollixGalleryAdapter,
  parts: ShadowParts,
  views: ViewState,
  showProgress: boolean,
): void => {
  parts.progress.hidden = !showProgress;
  views.unsubscribeProgress?.();
  views.unsubscribeProgress = showProgress
    ? adapter.runtime.subscribeState((state) => {
      parts.progressFill.style.transform = `scaleX(${state.progress})`;
    })
    : null;
};

const disposeViews = (views: ViewState): void => {
  views.unsubscribeProgress?.();
  views.bottomSheet?.dispose();
  views.desktopPanel?.dispose();
  views.unsubscribeProgress = null;
  views.bottomSheet = null;
  views.desktopPanel = null;
};

const createRuntimeProps = (props: ScrollixGalleryFramerProps): ScrollixGalleryProps => ({
  project: buildScrollixGalleryFramerProject(props),
  assetBaseUrl: props.assetBaseUrl || undefined,
  bottomSheetState: props.bottomSheetState,
  initialProgress: props.initialProgress,
  qualityOverride: normalizeQualityOverride(props.quality),
  autoStartJourney: props.autoStartJourney,
});

export function ScrollixGalleryFramer(props: ScrollixGalleryFramerProps): unknown {
  const mergedProps = { ...scrollixGalleryFramerDefaults, ...props };
  const hostRef = React.useRef<HTMLElement | null>(null);
  const adapterRef = React.useRef<ScrollixGalleryAdapter | null>(null);
  const viewsRef = React.useRef<ViewState>({
    bottomSheet: null,
    desktopPanel: null,
    unsubscribeProgress: null,
  });
  const updateVersionRef = React.useRef(0);
  const runtimeProps = React.useMemo(() => createRuntimeProps(mergedProps), [mergedProps]);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const parts = getShadowParts(host);
    const handleKeydown = (event: KeyboardEvent): void => {
      const runtime = adapterRef.current?.runtime;
      if (!runtime) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        runtime.nextItem();
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        runtime.previousItem();
      } else if (event.key === "Escape") {
        event.preventDefault();
        runtime.setBottomSheetState("collapsed");
      }
    };
    const handleViewportClick = (event: MouseEvent): void => {
      const runtime = adapterRef.current?.runtime;
      if (runtime && event.button === 0 && runtime.getContentSurface().state === "collapsed") {
        runtime.selectItemAtClientPoint(event.clientX, event.clientY);
      }
    };

    host.tabIndex = host.tabIndex >= 0 ? host.tabIndex : 0;
    host.addEventListener("keydown", handleKeydown);
    parts.viewport.addEventListener("click", handleViewportClick);

    return () => {
      host.removeEventListener("keydown", handleKeydown);
      parts.viewport.removeEventListener("click", handleViewportClick);
      disposeViews(viewsRef.current);
      adapterRef.current?.dispose();
      adapterRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const version = updateVersionRef.current + 1;
    updateVersionRef.current = version;
    const parts = getShadowParts(host);
    host.toggleAttribute("force-mobile", mergedProps.forceMobile);

    const run = async (): Promise<void> => {
      if (adapterRef.current) {
        await adapterRef.current.update(runtimeProps);
      } else {
        adapterRef.current = await mountScrollixGallery({
          container: parts.viewport,
          props: runtimeProps,
          scrollElement: host,
        });
      }

      if (updateVersionRef.current !== version || !adapterRef.current) {
        return;
      }

      syncContentViews(adapterRef.current, parts, viewsRef.current, mergedProps.showContentUi);
      syncProgressView(adapterRef.current, parts, viewsRef.current, mergedProps.showProgress);
    };

    void run();
  }, [runtimeProps, mergedProps.forceMobile, mergedProps.showContentUi, mergedProps.showProgress]);

  return React.createElement("div", {
    ref: hostRef,
    style: {
      width: "100%",
      height: "100%",
      minHeight: 420,
    },
  });
}

ScrollixGalleryFramer.defaultProps = scrollixGalleryFramerDefaults;

addPropertyControls(ScrollixGalleryFramer, {
  contentSource: {
    type: ControlType.Enum,
    title: "Content",
    options: ["controls", "projectJson"],
    optionTitles: ["Items controls", "Project JSON"],
  },
  projectJson: {
    type: ControlType.String,
    title: "Project JSON",
    displayTextArea: true,
    hidden: (props: ScrollixGalleryFramerProps) => props.contentSource !== "projectJson",
  },
  assetBaseUrl: { type: ControlType.String, title: "Asset Base" },
  template: {
    type: ControlType.Enum,
    title: "Template",
    options: ["default", "reduced"],
    optionTitles: ["Default", "Reduced debug"],
  },
  primary: { type: ControlType.Enum, title: "Texture", options: materialOptions },
  accent: { type: ControlType.Enum, title: "Accent", options: materialOptions },
  quality: { type: ControlType.Enum, title: "Quality", options: qualityOptions },
  atmosphere: {
    type: ControlType.Enum,
    title: "Atmosphere",
    options: ["calm", "bright", "nocturne", "neutral"],
  },
  overlayFramingMode: {
    type: ControlType.Enum,
    title: "Overlay",
    options: ["balanced", "frontal", "cinematic"],
    optionTitles: ["Balanced", "Frontal", "Cinematic"],
  },
  showBorders: { type: ControlType.Boolean, title: "Borders" },
  spacing: { type: ControlType.Number, title: "Spacing", min: 8, max: 22, step: 0.5 },
  width: { type: ControlType.Number, title: "Width", min: 5, max: 14, step: 0.25 },
  height: { type: ControlType.Number, title: "Height", min: 3, max: 7, step: 0.1 },
  depth: { type: ControlType.Number, title: "Depth", min: 120, max: 400, step: 10 },
  wallTextureTiling: { type: ControlType.Number, title: "Wall Tile", min: 0.25, max: 4, step: 0.05 },
  floorTextureTiling: { type: ControlType.Number, title: "Floor Tile", min: 0.25, max: 4, step: 0.05 },
  ceilingTextureTiling: { type: ControlType.Number, title: "Ceiling Tile", min: 0.25, max: 4, step: 0.05 },
  wallTextureDeformation: {
    type: ControlType.Enum,
    title: "Wall Shape",
    options: textureDeformationOptions,
    optionTitles: ["Stretched", "Square"],
  },
  floorTextureDeformation: {
    type: ControlType.Enum,
    title: "Floor Shape",
    options: textureDeformationOptions,
    optionTitles: ["Stretched", "Square"],
  },
  ceilingTextureDeformation: {
    type: ControlType.Enum,
    title: "Ceil Shape",
    options: textureDeformationOptions,
    optionTitles: ["Stretched", "Square"],
  },
  ceilingLightIntensity: { type: ControlType.Number, title: "Ceiling", min: 0, max: 2.5, step: 0.05 },
  ceilingLightRadius: { type: ControlType.Number, title: "Light Radius", min: 0.04, max: 0.22, step: 0.005 },
  ceilingLightColor: { type: ControlType.Color, title: "Ceiling Color" },
  ledColor: { type: ControlType.Color, title: "LED Color" },
  fov: { type: ControlType.Number, title: "FOV", min: 36, max: 68, step: 1 },
  cameraHeight: { type: ControlType.Number, title: "Camera", min: 1.2, max: 2.3, step: 0.01 },
  lookAhead: { type: ControlType.Number, title: "Look Ahead", min: 0.8, max: 7, step: 0.1 },
  desktopFramingDistance: { type: ControlType.Number, title: "Desktop Frame", min: 0.75, max: 2.5, step: 0.01 },
  mobileFramingDistance: { type: ControlType.Number, title: "Mobile Frame", min: 0.75, max: 2.5, step: 0.01 },
  mobileStationFramingDistance: { type: ControlType.Number, title: "Mobile Station", min: 0.75, max: 3, step: 0.01 },
  smoothing: { type: ControlType.Number, title: "Smoothing", min: 0.04, max: 0.4, step: 0.01 },
  damping: { type: ControlType.Number, title: "Damping", min: 0.2, max: 0.98, step: 0.01 },
  scrollStrength: {
    type: ControlType.Enum,
    title: "Scroll",
    options: scrollStrengthOptions,
    optionTitles: ["Auto", "0.5x", "0.75x", "1x", "1.5x", "2x", "3x", "4x", "5x"],
  },
  mobileScrollStrength: { type: ControlType.Number, title: "Mobile Scroll", min: 0.5, max: 4, step: 0.1 },
  loop: { type: ControlType.Boolean, title: "Loop" },
  forceMobile: { type: ControlType.Boolean, title: "Mobile UI" },
  autoStartJourney: { type: ControlType.Boolean, title: "Auto Scroll" },
  initialProgress: { type: ControlType.Number, title: "Progress", min: 0, max: 1, step: 0.01 },
  bottomSheetState: {
    type: ControlType.Enum,
    title: "Panel",
    options: ["collapsed", "half", "full"],
    optionTitles: ["Collapsed", "Half", "Full"],
  },
  showContentUi: { type: ControlType.Boolean, title: "Content UI" },
  showProgress: { type: ControlType.Boolean, title: "Progress Bar" },
  items: {
    type: ControlType.Array,
    title: "Items",
    maxCount: 24,
    hidden: (props: ScrollixGalleryFramerProps) => props.contentSource !== "controls",
    control: {
      type: ControlType.Object,
      controls: {
        id: { type: ControlType.String, title: "ID" },
        type: { type: ControlType.Enum, title: "Type", options: itemTypeOptions },
        placement: {
          type: ControlType.Enum,
          title: "Placement",
          options: placementOptions,
          optionTitles: ["Station", "Wall left", "Wall right", "Wall auto"],
        },
        title: { type: ControlType.String, title: "Title" },
        eyebrow: { type: ControlType.String, title: "Eyebrow" },
        subtitle: { type: ControlType.String, title: "Subtitle" },
        description: { type: ControlType.String, title: "Desc", displayTextArea: true },
        body: { type: ControlType.String, title: "Body", displayTextArea: true },
        image: { type: ControlType.Image, title: "Image" },
        imageAlt: { type: ControlType.String, title: "Alt" },
        size: { type: ControlType.Enum, title: "Size", options: sizeOptions },
        material: { type: ControlType.Enum, title: "Material", options: materialOptions },
        lighting: { type: ControlType.Enum, title: "Lighting", options: lightingOptions },
        variant: { type: ControlType.String, title: "Variant" },
        slot: { type: ControlType.Number, title: "Slot", min: 0, max: 10000, step: 1 },
        scale: { type: ControlType.Number, title: "Scale", min: 0.1, max: 8, step: 0.05 },
        offsetX: { type: ControlType.Number, title: "Offset X", min: -20, max: 20, step: 0.1 },
        offsetY: { type: ControlType.Number, title: "Offset Y", min: -20, max: 20, step: 0.1 },
        offsetZ: { type: ControlType.Number, title: "Offset Z", min: -40, max: 40, step: 0.1 },
      },
    },
  },
});

export default ScrollixGalleryFramer;
