import * as React from "react";
import { addPropertyControls, ControlType } from "framer";

type Quality = "auto" | "low" | "medium" | "high" | "ultra";
type Material = "stone" | "brick" | "wood" | "concrete" | "metal" | "glass";
type Overlay = "balanced" | "frontal" | "cinematic";
type BottomSheetState = "collapsed" | "half" | "full";
type ItemType = "statement" | "artwork" | "quote" | "profile" | "image" | "video" | "cta";
type Placement = "station" | "wall-left" | "wall-right" | "wall-auto";
type Size = "small" | "medium" | "large";
type Lighting = "none" | "subtle" | "featured";
type ScrollStrength = "auto" | 0.5 | 0.75 | 1 | 1.5 | 2 | 3 | 4 | 5;

interface RemoteItem {
  id?: string;
  type: ItemType;
  placement: Placement;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  size?: Size;
  material?: Material;
  lighting?: Lighting;
  variant?: string;
  slot?: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  offsetZ?: number;
}

interface ScrollixGalleryFramerRemoteProps {
  runtimeBaseUrl: string;
  runtimeScriptUrl: string;
  contentSource: "controls" | "projectJson";
  projectJson: string;
  template: "default" | "reduced";
  primary: Material;
  accent: Material;
  quality: Quality;
  atmosphere: "calm" | "bright" | "nocturne" | "neutral";
  overlayFramingMode: Overlay;
  showBorders: boolean;
  spacing: number;
  width: number;
  height: number;
  depth: number;
  ceilingLightIntensity: number;
  fov: number;
  cameraHeight: number;
  lookAhead: number;
  smoothing: number;
  damping: number;
  scrollStrength: ScrollStrength;
  loop: boolean;
  forceMobile: boolean;
  autoStartJourney: boolean;
  initialProgress: number;
  bottomSheetState: BottomSheetState;
  items: RemoteItem[];
  style?: React.CSSProperties;
}

const runtimePromises = new Map<string, Promise<void>>();
const tagName = "scrollix-gallery";
const defaultRuntimeBaseUrl = "https://capable-youtiao-4bc2f1.netlify.app";

const defaultItems: RemoteItem[] = [
  {
    id: "station-intro",
    type: "statement",
    placement: "station",
    title: "Creative Direction",
    eyebrow: "1/8 Station Template",
    description: "Template intro generated from Framer controls.",
    size: "large",
    material: "concrete",
    lighting: "featured",
  },
  {
    id: "portfolio-left",
    type: "artwork",
    placement: "wall-left",
    title: "Campaign System",
    eyebrow: "Portfolio",
    description: "Wall items use real project imagery while the camera moves toward the surface.",
    image: "/images/work1.jpg",
    imageAlt: "Campaign visual",
    size: "medium",
    material: "metal",
    lighting: "subtle",
  },
  {
    id: "launch-right",
    type: "quote",
    placement: "wall-right",
    title: "Make the space tell the story before the UI does.",
    eyebrow: "Statement",
    description: "The content layer stays synchronized with the camera journey.",
    size: "medium",
    material: "wood",
    lighting: "subtle",
  },
  {
    id: "station-services",
    type: "statement",
    placement: "station",
    title: "Brand Experience",
    eyebrow: "4/8 Station Template",
    description: "Central stations are crossed by the camera instead of treated like wall cards.",
    size: "large",
    lighting: "featured",
  },
  {
    id: "identity-right",
    type: "artwork",
    placement: "wall-right",
    title: "Modular Visual System",
    eyebrow: "Identity",
    description: "PNG portfolio assets from public/images can be dropped into the same contract.",
    image: "/images/project4.png",
    imageAlt: "Identity system artwork",
    size: "medium",
    material: "metal",
  },
  {
    id: "profile-left",
    type: "profile",
    placement: "wall-left",
    title: "Founder Spotlight",
    eyebrow: "Profile",
    description: "Profiles, quotes, images, CTAs and video share the same item contract.",
    size: "medium",
    material: "wood",
  },
  {
    id: "video-right",
    type: "video",
    placement: "wall-right",
    title: "Launch Film",
    eyebrow: "Motion",
    description: "Video can carry a real poster image without becoming a separate subsystem.",
    image: "/images/project2.png",
    imageAlt: "Launch film poster",
    size: "medium",
    material: "metal",
  },
  {
    id: "station-outro",
    type: "cta",
    placement: "station",
    title: "Build The Next Room",
    eyebrow: "8/8 Station Template",
    description: "Runtime adapters consume the same project object.",
    size: "large",
    lighting: "featured",
  },
];

const placeholderStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: "100%",
  height: "100%",
  minHeight: 420,
  color: "#f4efe6",
  background: "#171716",
  font: "600 13px system-ui, sans-serif",
  textAlign: "center",
  padding: 24,
};

const normalizeBaseUrl = (value: string): string =>
  (value || defaultRuntimeBaseUrl).trim().replace(/\/$/, "");

const resolveRuntimeScriptUrl = (props: ScrollixGalleryFramerRemoteProps): string => {
  const manual = props.runtimeScriptUrl?.trim();
  if (manual) {
    return manual;
  }

  return `${normalizeBaseUrl(props.runtimeBaseUrl)}/element.js`;
};

const loadRuntime = async (scriptUrl: string): Promise<void> => {
  if (typeof window === "undefined") {
    return;
  }

  if (window.customElements.get(tagName)) {
    return;
  }

  const existing = runtimePromises.get(scriptUrl);
  if (existing) {
    return existing;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const currentScript = Array.from(document.querySelectorAll("script")).find((script) =>
      script instanceof HTMLScriptElement && script.src === scriptUrl
    ) as HTMLScriptElement | undefined;
    const script = currentScript ?? document.createElement("script");

    script.type = "module";
    script.async = true;
    script.src = scriptUrl;

    const timeout = window.setTimeout(() => {
      reject(new Error(`Timed out loading Scrollix runtime: ${scriptUrl}`));
    }, 12000);

    const finish = async () => {
      try {
        window.ScrollixGalleryRuntime?.init?.();
        await window.customElements.whenDefined(tagName);
        window.clearTimeout(timeout);
        resolve();
      } catch (error) {
        window.clearTimeout(timeout);
        reject(error);
      }
    };

    script.addEventListener("load", () => void finish(), { once: true });
    script.addEventListener("error", () => {
      window.clearTimeout(timeout);
      reject(new Error(`Failed to load Scrollix runtime: ${scriptUrl}`));
    }, { once: true });

    if (!currentScript) {
      document.head.appendChild(script);
    }
  });

  runtimePromises.set(scriptUrl, promise);
  return promise;
};

const placementToSide = (placement: Placement): "left" | "right" | "center" | "auto" => {
  if (placement === "station") return "center";
  if (placement === "wall-left") return "left";
  if (placement === "wall-right") return "right";
  return "auto";
};

const imageFormat = (src: string): "jpg" | "png" | "webp" | "ktx2" | undefined => {
  const extension = src.split("?")[0]?.split(".").pop()?.toLowerCase();
  if (extension === "jpeg" || extension === "jpg") return "jpg";
  if (extension === "png" || extension === "webp" || extension === "ktx2") return extension;
  return undefined;
};

const slug = (value: string): string =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const buildProject = (props: ScrollixGalleryFramerRemoteProps) => {
  if (props.contentSource === "projectJson" && props.projectJson.trim()) {
    return JSON.parse(props.projectJson);
  }

  const sourceItems = props.items.map((item, index) => {
    const id = slug(item.id || item.title || `${item.type}-${index + 1}`) || `${item.type}-${index + 1}`;
    const image = typeof item.image === "string" && item.image.trim() ? item.image.trim() : undefined;

    return {
      id,
      type: item.type,
      placement: {
        side: placementToSide(item.placement),
        slot: item.slot,
        scale: item.scale,
        offset: {
          x: item.offsetX,
          y: item.offsetY,
          z: item.offsetZ,
        },
      },
      appearance: {
        size: item.size,
        material: item.material,
        lighting: item.lighting,
        variant: item.variant,
        media: image
          ? [{
              src: image,
              type: item.type === "video" ? "video" : "image",
              format: imageFormat(image),
              quality: "high",
              alt: item.imageAlt || item.title,
            }]
          : undefined,
      },
      content: {
        eyebrow: item.eyebrow,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        body: item.body,
      },
    };
  });
  const visibleItems = props.template === "reduced" ? sourceItems.slice(0, 3) : sourceItems;
  const scrollStrength = props.scrollStrength === "auto"
    ? Math.min(6, Math.max(0.25, sourceItems.length / Math.max(1, visibleItems.length)))
    : props.scrollStrength;

  return {
    theme: {
      quality: props.quality,
      atmosphere: props.atmosphere,
      materials: {
        primary: props.primary,
        accent: props.accent,
      },
      lighting: {
        ceilingLightIntensity: props.ceilingLightIntensity,
      },
      items: {
        showBorders: props.showBorders,
      },
    },
    layout: {
      type: "infinite-corridor",
      spacing: props.spacing,
      bounds: {
        width: props.width,
        height: props.height,
        depth: props.depth,
      },
    },
    journey: {
      mode: "scroll",
      artworkOverlayFramingMode: props.overlayFramingMode,
      loop: props.loop,
      smoothing: props.smoothing,
      damping: props.damping,
      scrollStrength,
      camera: {
        fov: props.fov,
        height: props.cameraHeight,
        lookAhead: props.lookAhead,
      },
    },
    items: visibleItems,
  };
};

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 1280
 * @framerIntrinsicHeight 760
 */
export default function ScrollixGalleryFramerRemote(props: ScrollixGalleryFramerRemoteProps) {
  const [state, setState] = React.useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = React.useState("");
  const scriptUrl = React.useMemo(() => resolveRuntimeScriptUrl(props), [props.runtimeBaseUrl, props.runtimeScriptUrl]);
  const assetBaseUrl = React.useMemo(() => normalizeBaseUrl(props.runtimeBaseUrl), [props.runtimeBaseUrl]);
  const project = React.useMemo(() => JSON.stringify(buildProject(props)), [props]);

  React.useEffect(() => {
    let cancelled = false;
    setState("loading");
    setError("");

    void loadRuntime(scriptUrl)
      .then(() => {
        if (!cancelled) setState("ready");
      })
      .catch((runtimeError) => {
        if (cancelled) return;
        setError(runtimeError instanceof Error ? runtimeError.message : "Scrollix runtime failed to load.");
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [scriptUrl]);

  if (state !== "ready") {
    return React.createElement(
      "div",
      { style: { ...placeholderStyle, ...(props.style || {}) } },
      state === "error" ? error : "Loading Scrollix Gallery runtime..."
    );
  }

  return React.createElement(tagName, {
    style: {
      display: "block",
      width: "100%",
      height: "100%",
      minHeight: "100%",
      minWidth: 0,
      ...(props.style || {}),
    },
    project,
    "asset-base-url": assetBaseUrl,
    "auto-start-journey": String(props.autoStartJourney),
    "initial-progress": String(props.initialProgress),
    "bottom-sheet-state": props.bottomSheetState,
    "force-mobile": props.forceMobile ? "" : undefined,
  });
}

ScrollixGalleryFramerRemote.defaultProps = {
  runtimeBaseUrl: defaultRuntimeBaseUrl,
  runtimeScriptUrl: "",
  contentSource: "controls",
  projectJson: "",
  template: "default",
  primary: "stone",
  accent: "metal",
  quality: "auto",
  atmosphere: "calm",
  overlayFramingMode: "balanced",
  showBorders: true,
  spacing: 14,
  width: 8,
  height: 4.2,
  depth: 360,
  ceilingLightIntensity: 1,
  fov: 50,
  cameraHeight: 1.72,
  lookAhead: 3.2,
  smoothing: 0.16,
  damping: 0.84,
  scrollStrength: "auto",
  loop: true,
  forceMobile: false,
  autoStartJourney: true,
  initialProgress: 0,
  bottomSheetState: "collapsed",
  items: defaultItems,
};

const materialOptions = ["stone", "brick", "wood", "concrete", "metal", "glass"];
const qualityOptions = ["auto", "low", "medium", "high", "ultra"];
const itemTypeOptions = ["statement", "artwork", "quote", "profile", "image", "video", "cta"];
const placementOptions = ["station", "wall-left", "wall-right", "wall-auto"];

addPropertyControls(ScrollixGalleryFramerRemote, {
  runtimeBaseUrl: { type: ControlType.String, title: "Runtime Base" },
  runtimeScriptUrl: { type: ControlType.String, title: "Runtime JS" },
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
    hidden: (props: ScrollixGalleryFramerRemoteProps) => props.contentSource !== "projectJson",
  },
  template: { type: ControlType.Enum, title: "Template", options: ["default", "reduced"] },
  primary: { type: ControlType.Enum, title: "Texture", options: materialOptions },
  accent: { type: ControlType.Enum, title: "Accent", options: materialOptions },
  quality: { type: ControlType.Enum, title: "Quality", options: qualityOptions },
  atmosphere: { type: ControlType.Enum, title: "Atmosphere", options: ["calm", "bright", "nocturne", "neutral"] },
  overlayFramingMode: { type: ControlType.Enum, title: "Overlay", options: ["balanced", "frontal", "cinematic"] },
  showBorders: { type: ControlType.Boolean, title: "Borders" },
  spacing: { type: ControlType.Number, title: "Spacing", min: 8, max: 22, step: 0.5 },
  width: { type: ControlType.Number, title: "Width", min: 5, max: 14, step: 0.25 },
  height: { type: ControlType.Number, title: "Height", min: 3, max: 7, step: 0.1 },
  depth: { type: ControlType.Number, title: "Depth", min: 120, max: 400, step: 10 },
  ceilingLightIntensity: { type: ControlType.Number, title: "Ceiling", min: 0, max: 2.5, step: 0.05 },
  fov: { type: ControlType.Number, title: "FOV", min: 36, max: 68, step: 1 },
  cameraHeight: { type: ControlType.Number, title: "Camera", min: 1.2, max: 2.3, step: 0.01 },
  lookAhead: { type: ControlType.Number, title: "Look Ahead", min: 0.8, max: 7, step: 0.1 },
  smoothing: { type: ControlType.Number, title: "Smoothing", min: 0.04, max: 0.4, step: 0.01 },
  damping: { type: ControlType.Number, title: "Damping", min: 0.2, max: 0.98, step: 0.01 },
  scrollStrength: {
    type: ControlType.Enum,
    title: "Scroll",
    options: ["auto", 0.5, 0.75, 1, 1.5, 2, 3, 4, 5],
    optionTitles: ["Auto", "0.5x", "0.75x", "1x", "1.5x", "2x", "3x", "4x", "5x"],
  },
  loop: { type: ControlType.Boolean, title: "Loop" },
  forceMobile: { type: ControlType.Boolean, title: "Mobile UI" },
  autoStartJourney: { type: ControlType.Boolean, title: "Auto Scroll" },
  initialProgress: { type: ControlType.Number, title: "Progress", min: 0, max: 1, step: 0.01 },
  bottomSheetState: { type: ControlType.Enum, title: "Panel", options: ["collapsed", "half", "full"] },
  items: {
    type: ControlType.Array,
    title: "Items",
    maxCount: 24,
    hidden: (props: ScrollixGalleryFramerRemoteProps) => props.contentSource !== "controls",
    control: {
      type: ControlType.Object,
      controls: {
        id: { type: ControlType.String, title: "ID" },
        type: { type: ControlType.Enum, title: "Type", options: itemTypeOptions },
        placement: { type: ControlType.Enum, title: "Placement", options: placementOptions },
        title: { type: ControlType.String, title: "Title" },
        eyebrow: { type: ControlType.String, title: "Eyebrow" },
        subtitle: { type: ControlType.String, title: "Subtitle" },
        description: { type: ControlType.String, title: "Desc", displayTextArea: true },
        body: { type: ControlType.String, title: "Body", displayTextArea: true },
        image: { type: ControlType.Image, title: "Image" },
        imageAlt: { type: ControlType.String, title: "Alt" },
        size: { type: ControlType.Enum, title: "Size", options: ["small", "medium", "large"] },
        material: { type: ControlType.Enum, title: "Material", options: materialOptions },
        lighting: { type: ControlType.Enum, title: "Lighting", options: ["none", "subtle", "featured"] },
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

declare global {
  interface Window {
    ScrollixGalleryRuntime?: {
      init(tagName?: string): void;
      registerWebComponents(tagName?: string): void;
    };
  }
}
